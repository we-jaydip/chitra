/**
 * PROFILE CREATION - MOBILE OPTIMIZED - THEME DRIVEN
 * - Uses global theme (COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS)
 * - Field labels translate with t()
 * - Politician requires Party & Position
 * - DropdownModal calls include all required props
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { allStates } from '@/lib/complete_indian_data';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const isSmallPhone = width < 375;

// Local height; fonts/spacing from theme
const INPUT_HEIGHT = isSmallPhone ? 40 : 44;

const titlePrefixes = [
  { id: 'mr', name_en: 'Mr.', name_mr: 'श्री', name_hi: 'श्री' },
  { id: 'mrs', name_en: 'Mrs.', name_mr: 'श्रीमती', name_hi: 'श्रीमती' },
  { id: 'ms', name_en: 'Ms.', name_mr: 'कु.', name_hi: 'सुश्री' },
  { id: 'dr', name_en: 'Dr.', name_mr: 'डॉ.', name_hi: 'डॉ.' },
];

const categoryOptions = [
  { id: 'public-figure', name_en: '🎬 Public Figure', name_mr: '🎬 जनप्रतिनिधी', name_hi: '🎬 जनप्रतिनिधि' },
  { id: 'politician', name_en: '🎖️ Politician', name_mr: '🎖️ राजकारणदज्ञ', name_hi: '🎖️ राजनेता' },
  { id: 'individual', name_en: '👤 Individual', name_mr: '👤 व्यक्तिगत', name_hi: '👤 व्यक्तिगत' },
  { id: 'business', name_en: '💼 Business', name_mr: '💼 व्यावसायिक', name_hi: '💼 व्यावसायिक' },
  { id: 'brand', name_en: '🏢 Brand', name_mr: '🏢 ब्रँड', name_hi: '🏢 ब्रांड' },
];

const politicalParties = [
  { id: 'bjp', name_en: 'BJP', name_mr: 'भाजप', name_hi: 'भाजपा' },
  { id: 'inc', name_en: 'INC', name_mr: 'काँग्रेस', name_hi: 'कांग्रेस' },
  { id: 'shiv-sena', name_en: 'Shiv Sena', name_mr: 'शिवसेना', name_hi: 'शिव सेना' },
  { id: 'ncp', name_en: 'NCP', name_mr: 'राष्ट्रवादी कांग्रेस', name_hi: 'राष्ट्रवादी कांग्रेस' },
  { id: 'aap', name_en: 'AAP', name_mr: 'आप', name_hi: 'आप' },
];

export default function ProfileCreation() {
  const { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } = useTheme();
  const { phone, user } = useAuth();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Form state
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone_field] = useState(phone || user?.phone_number || '');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [assembly, setAssembly] = useState('');
  const [category, setCategory] = useState('');
  const [pic, setPic] = useState<string | null>(null);

  // Politician
  const [politicalParty, setPoliticalParty] = useState('');
  const [politicalPosition, setPoliticalPosition] = useState('');

  // Optional social
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const [modal, setModal] = useState<string | null>(null);

  // Language-driven re-render
  useEffect(() => {
    const onLang = () => setRenderKey((p) => p + 1);
    i18n.on('languageChanged', onLang);
    return () => i18n.off('languageChanged', onLang);
  }, [i18n]);

  const lang = i18n.language;

  const getLabel = (obj: any): string => {
    if (!obj) return '';
    if (lang === 'marathi') return obj.name_mr || obj.name_en || '';
    if (lang === 'hindi') return obj.name_hi || obj.name_en || '';
    return obj.name_en || '';
  };

  const currentState = allStates.find((s: any) => s.id === state);
  const districts = currentState?.districts || [];
  const currentDistrict = districts.find((d: any) => d.id === district);
  const tehsils = currentDistrict?.tehsils || [];
  const vidhansabha = currentState?.vidhansabha || [];

  const validate = (): boolean => {
    if (!title || !firstName || !surname || !phone_field) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }
    if (!state || !district || !tehsil) {
      Alert.alert('Error', 'Please select State, District, and Tehsil');
      return false;
    }
    if (!category) {
      Alert.alert('Error', 'Please select your category');
      return false;
    }
    if (category === 'politician') {
      if (!politicalParty) {
        Alert.alert('Error', 'Please select your political party');
        return false;
      }
      if (!politicalPosition || politicalPosition.trim() === '') {
        Alert.alert('Error', 'Please enter your political position');
        return false;
      }
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const profile = {
        title,
        firstName,
        middleName,
        surname,
        phone: phone_field,
        email: email || null,
        state,
        district,
        tehsil,
        assembly: assembly || null,
        category,
        politicalParty: category === 'politician' ? politicalParty : null,
        politicalPosition: category === 'politician' ? politicalPosition : null,
        pic,
        whatsapp: whatsapp || null,
        website: website || null,
        instagram: instagram || null,
        facebook: facebook || null,
        twitter: twitter || null,
        language: lang,
      };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPic(result.assets[0].uri);
  };

  const PADDING_H = isSmallPhone ? width * 0.04 : width * 0.05;

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.primary },
    container: { flex: 1 },
    scroll: { flex: 1, paddingHorizontal: PADDING_H, paddingVertical: SPACING.sm },
    header: { marginBottom: SPACING.md },
    headerTitle: { fontSize: isSmallPhone ? 22 : 24, fontWeight: FONTS.weight.bold as any, color: COLORS.textInverse },

    picBox: {
      width: '100%',
      height: isSmallPhone ? 120 : 150,
      borderRadius: BORDER_RADIUS.md,
      overflow: 'hidden',
      marginBottom: SPACING.md,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: 'rgba(255,255,255,0.5)',
    },
    pic: { width: '100%', height: '100%' },
    picPlaceholder: { alignItems: 'center' },
    picEmoji: { fontSize: isSmallPhone ? 32 : 40 },

    section: {
      backgroundColor: COLORS.bgPrimary,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      ...SHADOWS.sm,
    },
    sectionTitle: { fontSize: FONTS.size.lg, fontWeight: FONTS.weight.bold as any, color: COLORS.primary, marginBottom: SPACING.sm },

    label: {
      fontSize: isSmallPhone ? 12 : 13,
      fontWeight: FONTS.weight.semibold as any,
      color: COLORS.textPrimary,
      marginBottom: 6,
      marginTop: 10,
    },

    input: {
      backgroundColor: COLORS.gray50,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.lg,
      height: INPUT_HEIGHT,
      marginBottom: 10,
      fontSize: isSmallPhone ? 13 : 14,
      borderWidth: 1,
      borderColor: COLORS.gray200,
      justifyContent: 'center',
      color: COLORS.textPrimary,
    },
    disabled: { backgroundColor: COLORS.gray100 },
    phoneText: { fontSize: isSmallPhone ? 13 : 14, color: COLORS.textPrimary, fontWeight: FONTS.weight.medium as any },

    dropdown: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.lg,
      height: INPUT_HEIGHT,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.gray200,
    },
    dropdownText: { flex: 1, fontSize: isSmallPhone ? 13 : 14, color: COLORS.textPrimary },

    categoryBtn: {
      backgroundColor: COLORS.gray50,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: COLORS.gray200,
    },
    categoryBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    categoryName: { fontSize: isSmallPhone ? 12 : 13, fontWeight: FONTS.weight.semibold as any, color: COLORS.textPrimary },
    categoryNameActive: { color: COLORS.textInverse },

    toggleBtn: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      marginBottom: 10,
      backgroundColor: 'rgba(255,136,0,0.1)',
      borderRadius: BORDER_RADIUS.md,
    },
    toggleBtnText: { fontSize: isSmallPhone ? 12 : 13, fontWeight: FONTS.weight.semibold as any, color: COLORS.primary },

    submitBtn: {
      backgroundColor: COLORS.secondary || COLORS.primary,
      borderRadius: BORDER_RADIUS.lg,
      paddingVertical: isSmallPhone ? 12 : 14,
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 10,
    },
    submitBtnDisabled: { opacity: 0.6 },
    submitBtnText: { fontSize: isSmallPhone ? 13 : 14, fontWeight: FONTS.weight.bold as any, color: COLORS.white },

    modalOverlay: { flex: 1, backgroundColor: COLORS.bgOverlay, justifyContent: 'flex-end' },
    modalBox: { backgroundColor: COLORS.bgPrimary, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.7 },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: PADDING_H,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.gray200,
    },
    modalTitle: { fontSize: isSmallPhone ? 13 : 14, fontWeight: FONTS.weight.bold as any, color: COLORS.primary },
    closeBtn: { fontSize: 24, color: COLORS.textSecondary },
    modalItem: { paddingHorizontal: PADDING_H, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
    modalItemText: { fontSize: isSmallPhone ? 13 : 14, color: COLORS.textPrimary },
  });

  const DropdownModal = ({
    visible,
    items,
    onSelect,
    title: modalTitle,
  }: {
    visible: boolean;
    items: any[];
    onSelect: (item: any) => void;
    title: string;
  }) => (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TouchableOpacity onPress={() => setModal(null)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item: any, idx: number) => `${item.id || idx}`}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  onSelect(item);
                  setModal(null);
                }}
              >
                <Text style={styles.modalItemText}>{getLabel(item)}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.container} key={renderKey}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>📝 {t('profileCreation.title')}</Text>
          </View>

          {/* Picture */}
          <TouchableOpacity style={styles.picBox} onPress={pickImage}>
            {pic ? <Image source={{ uri: pic }} style={styles.pic} /> : <View style={styles.picPlaceholder}><Text style={styles.picEmoji}>📷</Text></View>}
          </TouchableOpacity>

          {/* Section 1 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 {t('profileCreation.step1')}</Text>

            <Text style={styles.label}>👨‍💼 {t('profileCreation.titlePrefix')}</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setModal('title')}>
              <Text style={styles.dropdownText}>
                {title ? getLabel(titlePrefixes.find((p: any) => p.id === title)) : t('profileCreation.selectTitle')}
              </Text>
              <Text>▼</Text>
            </TouchableOpacity>

            <Text style={styles.label}>📛 {t('profileCreation.firstName')} *</Text>
            <RNTextInput
              style={styles.input}
              placeholder={t('profileCreation.enterFirstName')}
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor={COLORS.textTertiary}
            />

            <Text style={styles.label}>📝 {t('profileCreation.middleName')}</Text>
            <RNTextInput
              style={styles.input}
              placeholder={t('profileCreation.enterMiddleName')}
              value={middleName}
              onChangeText={setMiddleName}
              placeholderTextColor={COLORS.textTertiary}
            />

            <Text style={styles.label}>🔤 {t('profileCreation.surname')} *</Text>
            <RNTextInput
              style={styles.input}
              placeholder={t('profileCreation.enterSurname')}
              value={surname}
              onChangeText={setSurname}
              placeholderTextColor={COLORS.textTertiary}
            />

            <Text style={styles.label}>📱 {t('profileCreation.phone')} *</Text>
            <View style={[styles.input, styles.disabled]}>
              <Text style={styles.phoneText}>+91 {phone_field}</Text>
            </View>

            <Text style={styles.label}>📧 {t('profileCreation.email')}</Text>
            <RNTextInput
              style={styles.input}
              placeholder={t('profileCreation.enterEmail')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          {/* Section 2 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🗺️ {t('profileCreation.step2')}</Text>

            <Text style={styles.label}>🏛️ {t('profileCreation.selectState')} *</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setModal('state')}>
              <Text style={styles.dropdownText}>
                {state ? getLabel(allStates.find((s: any) => s.id === state)) : t('profileCreation.selectState')}
              </Text>
              <Text>▼</Text>
            </TouchableOpacity>

            {state && (
              <>
                <Text style={styles.label}>📍 {t('profileCreation.selectDistrict')} *</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setModal('district')}>
                  <Text style={styles.dropdownText}>
                    {district ? getLabel(districts.find((d: any) => d.id === district)) : t('profileCreation.selectDistrict')}
                  </Text>
                  <Text>▼</Text>
                </TouchableOpacity>
              </>
            )}

            {district && (
              <>
                <Text style={styles.label}>🏘️ {t('profileCreation.selectTehsil')} *</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setModal('tehsil')}>
                  <Text style={styles.dropdownText}>
                    {tehsil ? getLabel(tehsils.find((t: any) => t.id === tehsil)) : t('profileCreation.selectTehsil')}
                  </Text>
                  <Text>▼</Text>
                </TouchableOpacity>
              </>
            )}

            {state && (
              <>
                <Text style={styles.label}>🏢 {t('profileCreation.vidhansabha')}</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setModal('assembly')}>
                  <Text style={styles.dropdownText}>
                    {assembly || t('profileCreation.selectVidhansabha')}
                  </Text>
                  <Text>▼</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Section 3 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 {t('profileCreation.step3')} *</Text>

            {categoryOptions.map((cat: any) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryBtn, category === cat.id && styles.categoryBtnActive]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={[styles.categoryName, category === cat.id && styles.categoryNameActive]}>
                  {getLabel(cat)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section 4 */}
          {category === 'politician' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎖️ {t('profileCreation.politicalDetails')}</Text>

              <Text style={styles.label}>🏛️ {t('profileCreation.politicalParty')} * (Required)</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setModal('party')}>
                <Text style={styles.dropdownText}>
                  {politicalParty ? getLabel(politicalParties.find((p: any) => p.id === politicalParty)) : t('profileCreation.selectParty')}
                </Text>
                <Text>▼</Text>
              </TouchableOpacity>

              <Text style={styles.label}>📋 {t('profileCreation.politicalDesignation')} * (Required)</Text>
              <RNTextInput
                style={styles.input}
                placeholder="e.g., MLA, Councillor, Minister"
                value={politicalPosition}
                onChangeText={setPoliticalPosition}
                placeholderTextColor={COLORS.textTertiary}
              />
            </View>
          )}

          {/* Section 5 */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowOptionalFields(!showOptionalFields)}>
              <Text style={styles.toggleBtnText}>
                {showOptionalFields ? '▼' : '▶'} {t('profileCreation.optionalSocialMedia')}
              </Text>
            </TouchableOpacity>

            {showOptionalFields && (
              <>
                <Text style={styles.label}>📱 {t('profileCreation.whatsappNumber')}</Text>
                <RNTextInput
                  style={styles.input}
                  placeholder="10-digit number (optional)"
                  value={whatsapp}
                  onChangeText={setWhatsapp}
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.textTertiary}
                />

                <Text style={styles.label}>🌐 {t('profileCreation.website')}</Text>
                <RNTextInput
                  style={styles.input}
                  placeholder="https://example.com (optional)"
                  value={website}
                  onChangeText={setWebsite}
                  placeholderTextColor={COLORS.textTertiary}
                />

                <Text style={styles.label}>📸 {t('profileCreation.instagramUsername')}</Text>
                <RNTextInput
                  style={styles.input}
                  placeholder="@username (optional)"
                  value={instagram}
                  onChangeText={setInstagram}
                  placeholderTextColor={COLORS.textTertiary}
                />

                <Text style={styles.label}>👍 {t('profileCreation.facebookUsername')}</Text>
                <RNTextInput
                  style={styles.input}
                  placeholder="facebook.com/username (optional)"
                  value={facebook}
                  onChangeText={setFacebook}
                  placeholderTextColor={COLORS.textTertiary}
                />

                <Text style={styles.label}>𝕏 {t('profileCreation.twitterUsername')}</Text>
                <RNTextInput
                  style={styles.input}
                  placeholder="@username (optional)"
                  value={twitter}
                  onChangeText={setTwitter}
                  placeholderTextColor={COLORS.textTertiary}
                />
              </>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>✓ {t('profileCreation.completeProfile')}</Text>}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>

      {/* Modals - all props provided */}
      <DropdownModal
        visible={modal === 'title'}
        items={titlePrefixes}
        onSelect={(item: any) => setTitle(item.id)}
        title={t('profileCreation.titlePrefix')}
      />

      <DropdownModal
        visible={modal === 'state'}
        items={allStates}
        onSelect={(item: any) => {
          setState(item.id);
          setDistrict('');
          setTehsil('');
          setAssembly('');
        }}
        title={t('profileCreation.selectState')}
      />

      <DropdownModal
        visible={modal === 'district'}
        items={districts}
        onSelect={(item: any) => {
          setDistrict(item.id);
          setTehsil('');
        }}
        title={t('profileCreation.selectDistrict')}
      />

      <DropdownModal
        visible={modal === 'tehsil'}
        items={tehsils}
        onSelect={(item: any) => setTehsil(item.id)}
        title={t('profileCreation.selectTehsil')}
      />

      <DropdownModal
        visible={modal === 'assembly'}
        items={vidhansabha}
        onSelect={(item: any) => setAssembly(getLabel(item))}
        title={t('profileCreation.vidhansabha')}
      />

      <DropdownModal
        visible={modal === 'party'}
        items={politicalParties}
        onSelect={(item: any) => setPoliticalParty(item.id)}
        title={t('profileCreation.politicalParty')}
      />
    </SafeAreaView>
  );
}
