import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  ActivityIndicator, StyleSheet, Alert, ScrollView 
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [serverUrl, setServerUrl] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [srtPath, setSrtPath] = useState(null);

  // اختيار ملف الصوت من جهاز الهواوي
  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (!result.canceled && result.assets[0]) {
        setAudioFile(result.assets[0]);
        setSrtPath(null);
      }
    } catch (err) {
      Alert.alert("خطأ", "فشل اختيار الملف");
    }
  };

  // إرسال الملف للسيرفر وتوليد الترجمة
  const processAudio = async () => {
    if (!serverUrl) {
      Alert.alert("تنبيه", "رجاءً ادخل رابط السيرفر أولاً");
      return;
    }
    if (!audioFile) {
      Alert.alert("تنبيه", "رجاءً اختر ملف الصوت");
      return;
    }

    setLoading(true);
    try {
      const cleanUrl = serverUrl.trim().replace(/\/+$/, '');
      const fullEndpoint = `${cleanUrl}/translate-audio`;

      const uploadResult = await FileSystem.uploadAsync(fullEndpoint, audioFile.uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
      });

      if (uploadResult.status === 200) {
        const targetPath = FileSystem.documentDirectory + `${audioFile.name}.srt`;
        await FileSystem.writeAsStringAsync(targetPath, uploadResult.body);
        setSrtPath(targetPath);
        Alert.alert("تم بنجاح! 🚀", "تم توليد ملف الترجمة بنجاح.");
      } else {
        Alert.alert("خطأ في السيرفر", `كود الخطأ: ${uploadResult.status}`);
      }
    } catch (error) {
      Alert.alert("خطأ اتصال", "تأكد من صحة رابط السيرفر وأن السيرفر شغال.");
    } finally {
      setLoading(false);
    }
  };

  // حفظ ومشاركة ملف الـ SRT
  const downloadSRT = async () => {
    if (srtPath && await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(srtPath);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Subtitle Studio 🎬</Text>
      <Text style={styles.subtitle}>توليد ترجمات SRT الفورية بالذكاء الاصطناعي</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>رابط السيرفر:</Text>
        <TextInput
          style={styles.input}
          placeholder="https://xxxx.ngrok-free.app"
          placeholderTextColor="#64748B"
          value={serverUrl}
          onChangeText={setServerUrl}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.uploadBox} onPress={pickAudio}>
        <Text style={styles.uploadText}>
          {audioFile ? `📁 تم اختيار: ${audioFile.name}` : "اضغط هنا لاختيار ملف صوت الفيلم"}
        </Text>
      </TouchableOpacity>

      {audioFile && !loading && (
        <TouchableOpacity style={styles.processBtn} onPress={processAudio}>
          <Text style={styles.btnText}>بدء الترجمة بالذكاء الاصطناعي ⚡</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#38BDF8" />
          <Text style={styles.loadingText}>جاري معالجة الفيلم بالذكاء الاصطناعي...</Text>
          <Text style={styles.timeHint}>الوقت المتوقع: 3 إلى 5 دقائق فقط ⏱️</Text>
        </View>
      )}

      {srtPath && (
        <TouchableOpacity style={styles.downloadBtn} onPress={downloadSRT}>
          <Text style={styles.btnText}>📥 حفظ / مشاركة ملف الـ SRT</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0F172A', padding: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginBottom: 28 },
  inputGroup: { marginBottom: 20 },
  label: { color: '#E2E8F0', fontSize: 14, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#1E293B', color: '#FFF', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#334155' },
  uploadBox: { backgroundColor: '#1E293B', borderWidth: 2, borderColor: '#38BDF8', borderStyle: 'dashed', borderRadius: 14, padding: 28, alignItems: 'center', marginBottom: 20 },
  uploadText: { color: '#38BDF8', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  processBtn: { backgroundColor: '#6366F1', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  downloadBtn: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  loadingBox: { alignItems: 'center', marginVertical: 20 },
  loadingText: { color: '#FFF', marginTop: 12, fontSize: 16, fontWeight: '600' },
  timeHint: { color: '#94A3B8', marginTop: 6, fontSize: 13 }
});
