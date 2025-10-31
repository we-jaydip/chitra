import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const { setLanguage } = useAuth();
  const { t } = useTranslation();

  const languages = [
    { id: 'english', label: 'English', flag: '🇮🇳' },
    { id: 'marathi', label: 'मराठी', flag: '🇮🇳' },
    { id: 'hindi', label: 'हिन्दी', flag: '🇮🇳' },
  ];

  const handleLanguageSelect = async (languageId: string) => {
    setSelectedLanguage(languageId);
    await setLanguage(languageId);
    setTimeout(() => {
      router.replace('/profile-creation');
    }, 200);
  };

  return (
    <LinearGradient
      colors={['#E75C6F', '#C73F5B']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Select Language</Text>
        <Text style={styles.subtitle}>Choose your preferred language</Text>

        <View style={styles.languagesContainer}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.id}
              style={[
                styles.languageButton,
                selectedLanguage === language.id && styles.languageButtonSelected
              ]}
              onPress={() => handleLanguageSelect(language.id)}
            >
              <Text style={styles.flag}>{language.flag}</Text>
              <Text 
                style={[
                  styles.languageText,
                  selectedLanguage === language.id && styles.languageTextSelected
                ]}
              >
                {language.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>Choose a language to continue</Text>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 60,
  },
  languagesContainer: {
    gap: 15,
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    gap: 15,
  },
  languageButtonSelected: {
    backgroundColor: '#FDD835',
    borderColor: '#FDD835',
  },
  flag: {
    fontSize: 28,
  },
  languageText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  languageTextSelected: {
    color: '#000',
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 60,
  },
});
