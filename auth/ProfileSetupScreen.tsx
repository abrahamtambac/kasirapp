import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';

type User = {
  name: string;
  email: string;
};

type Props = {
  user: User;
  onComplete: (updates: { namaToko?: string; alamat?: string; telepon?: string }) => void;
  onLogout: () => void;
};

export default function ProfileSetupScreen({ user, onComplete, onLogout }: Props) {
  const [namaToko, setNamaToko] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const [btnScale] = useState(new Animated.Value(1));

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 120, useNativeDriver: false }),
      Animated.timing(btnScale, { toValue: 1, duration: 120, useNativeDriver: false }),
    ]).start();
  };

  const handleSubmit = () => {
    if (!namaToko.trim()) {
      Alert.alert('Perhatian', 'Nama toko wajib diisi');
      return;
    }

    onComplete({
      namaToko: namaToko.trim(),
      alamat: alamat.trim() || undefined,
      telepon: telepon.trim() || undefined,
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Lengkapi Profil Toko</Text>
          <Text style={styles.subtitle}>
            Halo, {user.name} ({user.email})
          </Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.inputContainer, focused === 'namaToko' && styles.focused]}>
            <TextInput
              style={styles.input}
              placeholder="Nama Toko / Usaha *"
              value={namaToko}
              onChangeText={setNamaToko}
              autoCapitalize="words"
              placeholderTextColor="#9ca3af"
              onFocus={() => setFocused('namaToko')}
              onBlur={() => setFocused(null)}
            />
          </View>

          <View style={[styles.inputContainer, focused === 'alamat' && styles.focused]}>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Alamat Lengkap"
              value={alamat}
              onChangeText={setAlamat}
              multiline
              placeholderTextColor="#9ca3af"
              onFocus={() => setFocused('alamat')}
              onBlur={() => setFocused(null)}
            />
          </View>

          <View style={[styles.inputContainer, focused === 'telepon' && styles.focused]}>
            <TextInput
              style={styles.input}
              placeholder="Nomor Telepon / WhatsApp"
              value={telepon}
              onChangeText={setTelepon}
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
              onFocus={() => setFocused('telepon')}
              onBlur={() => setFocused(null)}
            />
          </View>

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => {
                animatePress();
                handleSubmit();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>Simpan & Lanjut</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={onLogout} style={styles.logout}>
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc' },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 8 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 6,
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  focused: {
    borderColor: '#6366f1',
    backgroundColor: '#ffffff',
    shadowColor: '#6366f1',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  input: { padding: 16, fontSize: 16, color: '#1e293b' },
  btnPrimary: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  logout: { alignItems: 'center', marginTop: 24 },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
});