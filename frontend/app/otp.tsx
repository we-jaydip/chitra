import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';

// TEST CONFIGURATION - For Testing Only
const TEST_PHONE = '9876543210';     // Test phone number (without +91)
const TEST_OTP = '2308';              // Test OTP for that number

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(27);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const { verifyOTP } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to normalize phone number for comparison
  const normalizePhone = (phoneNum: string) => {
    return (phoneNum || '')
      .replace('+91', '')
      .replace(/\D/g, '')
      .slice(-10); // Get last 10 digits
  };

  // Helper function to check if it's test phone
  const isTestPhone = () => {
    const normalized = normalizePhone(phone);
    return normalized === TEST_PHONE;
  };

  const handleOtpChange = async (value: string, index: number) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
      const otpString = newOtp.join('');
      
      let isValid = false;

      // Check if it's test phone
      if (isTestPhone()) {
        isValid = otpString === TEST_OTP;
      } else {
        // For real numbers, call actual verification
        isValid = await verifyOTP(phone || '', otpString);
      }

      if (isValid) {
        setTimeout(() => {
          router.replace('/language');
        }, 300);
      } else {
        setOtp(['', '', '', '']);
        Alert.alert('Invalid OTP', 'Please try again');
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter all 4 digits');
      return;
    }

    let isValid = false;

    // Check if it's test phone
    if (isTestPhone()) {
      isValid = otpString === TEST_OTP;
    } else {
      // For real numbers, call actual verification
      isValid = await verifyOTP(phone || '', otpString);
    }

    if (isValid) {
      router.replace('/language');
    } else {
      setOtp(['', '', '', '']);
      Alert.alert('Invalid OTP', isTestPhone() ? `Test OTP is ${TEST_OTP}` : 'Please try again');
    }
  };

  return (
    <LinearGradient
      colors={['#E75C6F', '#C73F5B']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>We've sent a verification code via WhatsApp to</Text>
        <Text style={styles.phone}>+91 {phone}</Text>
        <Text style={styles.whatsappNote}>📱 Check your WhatsApp messages</Text>

        {/* TEST MODE INDICATOR - Remove before production */}
        {isTestPhone() && (
          <View style={styles.testIndicator}>
            <Text style={styles.testText}>🧪 TEST MODE - OTP: {TEST_OTP}</Text>
          </View>
        )}

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
              placeholder="0"
              placeholderTextColor="#CCC"
            />
          ))}
        </View>

        <Text style={styles.resend}>
          Resend OTP in {timer}s
        </Text>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyOTP}
        >
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.editButtonText}>Edit Phone Number</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 8,
  },
  phone: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FDD835',
    textAlign: 'center',
    marginBottom: 20,
  },
  whatsappNote: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  testIndicator: {
    backgroundColor: 'rgba(253, 216, 53, 0.2)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FDD835',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  testText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FDD835',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: 70,
    height: 70,
    backgroundColor: '#FFF',
    borderRadius: 12,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
    borderWidth: 2,
    borderColor: '#FDD835',
  },
  resend: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  verifyButton: {
    backgroundColor: '#FDD835',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDD835',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FDD835',
  },
});
