import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, ScrollView, 
  TouchableOpacity, Image, SafeAreaView, StatusBar, Modal, Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const FEATURED_MOVIES = [
  {
    id: '1',
    title: 'Avatar: The Way of Water',
    category: 'خيال علمي • أكشن',
    year: '2022',
    rating: '8.8',
    poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclL2A933vOC333.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w500/vL5LR6W3R8S9533vOC333.jpg',
    description: 'يتعين على جيك سولي ومقاطعة نايتيري الخروج من موطنهم واستكشاف أقاليم باندورا لحماية عائلتهم.',
    torrents: [
      { id: 't1', quality: '4K UltraHD HDR', audio: '🇸🇦 دبلجة عربية 5.1', size: '24.8 GB', seeders: 1420, leechers: 85, hash: 'magnet:?xt=urn:btih:avatar4k' },
      { id: 't2', quality: '1080p BluRay', audio: '🇬🇧 مترجم عربي', size: '4.5 GB', seeders: 3200, leechers: 140, hash: 'magnet:?xt=urn:btih:avatar1080' },
      { id: 't3', quality: '720p WEB-DL', audio: '🇸🇦 دبلجة عربية', size: '1.8 GB', seeders: 890, leechers: 22, hash: 'magnet:?xt=urn:btih:avatar720' }
    ]
  },
  {
    id: '2',
    title: 'Oppenheimer',
    category: 'سيرة ذاتية • دراما',
    year: '2023',
    rating: '8.9',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGvC2I31Xm4.jpg',
    description: 'قصة العالم الأمريكي جيه. روبرت أوبنهايمر ودوره في تطوير القنبلة الذرية خلال مشروع مانهاتن.',
    torrents: [
      { id: 't4', quality: '4K IMAX Remux', audio: '🇬🇧 مترجم عربي', size: '42.1 GB', seeders: 2150, leechers: 310, hash: 'magnet:?xt=urn:btih:oppen4k' },
      { id: 't5', quality: '1080p Full HD', audio: '🇬🇧 مترجم عربي', size: '3.8 GB', seeders: 4500, leechers: 200, hash: 'magnet:?xt=urn:btih:oppen1080' }
    ]
  },
  {
    id: '3',
    title: 'Dune: Part Two',
    category: 'مغامرة • خيال علمي',
    year: '2024',
    rating: '8.6',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLPoL3VFiB2A23L3L31.jpg',
    description: 'يتحد بول أتريدس مع تشاني والفريمن للثأر من المتآمرين الذين دمروا عائلته.',
    torrents: [
      { id: 't6', quality: '4K Dolby Vision', audio: '🇬🇧 مترجم + دبلجة', size: '31.2 GB', seeders: 3890, leechers: 420, hash: 'magnet:?xt=urn:btih:dune4k' }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('الكل');
  const [selectedMovieModal, setSelectedMovieModal] = useState(null);
  const [magnetInput, setMagnetInput] = useState('');

  // شبكة التحميل الحية (الفناء الخلفي)
  const [downloads, setDownloads] = useState([
    { id: 'd1', title: 'Avatar: The Way of Water (4K HDR 🇸🇦)', progress: 68, speed: '28.4 MB/s', seeds: 312, size: '24.8 GB', status: 'downloading' },
    { id: 'd2', title: 'Oppenheimer (1080p Full HD)', progress: 100, speed: '0 KB/s', seeds: 850, size: '3.8 GB', status: 'completed' }
  ]);

  // محاكاة محرك التورنت الحي والسحب الشبكي P2P
  useEffect(() => {
    const torrentEngine = setInterval(() => {
      setDownloads(prev => 
        prev.map(item => {
          if (item.status === 'downloading' && item.progress < 100) {
            const nextProgress = item.progress + 1;
            const dynamicSpeed = (Math.random() * 15 + 20).toFixed(1);
            return {
              ...item,
              progress: nextProgress >= 100 ? 100 : nextProgress,
              speed: nextProgress >= 100 ? '0 KB/s' : `${dynamicSpeed} MB/s`,
              status: nextProgress >= 100 ? 'completed' : 'downloading'
            };
          }
          return item;
        })
      );
    }, 800);
    return () => clearInterval(torrentEngine);
  }, []);

  const addTorrentFromMagnet = () => {
    if (!magnetInput.trim()) return;
    const newDownload = {
      id: Date.now().toString(),
      title: `رابط Magnet خارجي #${downloads.length + 1}`,
      progress: 1,
      speed: '18.2 MB/s',
      seeds: 120,
      size: '12.4 GB',
      status: 'downloading'
    };
    setDownloads([newDownload, ...downloads]);
    setMagnetInput('');
    setActiveTab('downloads');
  };

  const startDownloadFromCatalog = (torrent, movie) => {
    const newDownload = {
      id: Date.now().toString(),
      title: `${movie.title} (${torrent.quality})`,
      progress: 1,
      speed: '32.5 MB/s',
      seeds: torrent.seeders,
      size: torrent.size,
      status: 'downloading'
    };
    setDownloads([newDownload, ...downloads]);
    setSelectedMovieModal(null);
    setActiveTab('downloads');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080c14" />
      
      {/* 1. الشريط العلوي السينمائي العالمي */}
      <View style={styles.topBar}>
        <View style={styles.brandContainer}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandIcon}>⚡</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>TORRENT<Text style={{color: '#e11d48'}}>E</Text> <Text style={styles.proTag}>PRO</Text></Text>
            <Text style={styles.brandSub}>شبكة P2P فائقة السرعة</Text>
          </View>
        </View>

        <View style={styles.engineStatus}>
          <Text style={styles.engineDot}>🟢</Text>
          <Text style={styles.engineText}>LibTorrent v2.0 Active</Text>
        </View>
      </View>

      {/* 2. تبويب المعرض الأسطوري */}
      {activeTab === 'home' && (
        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
          {/* محرك البحث الإحترافي */}
          <View style={styles.searchSection}>
            <View style={styles.searchBarContainer}>
              <Text style={{marginRight: 10, fontSize: 16}}>🔍</Text>
              <TextInput 
                placeholder="ابحث عن أفلام، جودة 4K، دبلجة، أو هاش..." 
                placeholderTextColor="#64748b"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* فلاتر التصنيف السريعة */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
            {['الكل', '🔥 الأكثر سحباً', '4K UltraHD', '🇸🇦 دبلجة عربية', 'أنمي', 'مسلسلات'].map((filter) => (
              <TouchableOpacity 
                key={filter} 
                onPress={() => setSelectedFilter(filter)}
                style={[styles.filterChip, selectedFilter === filter && styles.activeFilterChip]}
              >
                <Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* البانر الرئيسيي (Hero Section) */}
          <View style={styles.heroSection}>
            <Image source={{ uri: FEATURED_MOVIES[0].poster }} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroBadge}>⭐ الأكثر طلباً اليوم</Text>
              <Text style={styles.heroTitle}>{FEATURED_MOVIES[0].title}</Text>
              <Text style={styles.heroMeta}>{FEATURED_MOVIES[0].category} • {FEATURED_MOVIES[0].year}</Text>
              <TouchableOpacity 
                style={styles.heroButton}
                onPress={() => setSelectedMovieModal(FEATURED_MOVIES[0])}
              >
                <Text style={styles.heroButtonText}>⚡ استعراض روابط السحب (4K)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* شبكة الكروت والأفلام */}
          <Text style={styles.sectionHeader}>💎 الأحدث في الشبكة العالمية</Text>
          <View style={styles.movieGrid}>
            {FEATURED_MOVIES.map((movie) => (
              <TouchableOpacity 
                key={movie.id} 
                style={styles.gridCard}
                onPress={() => setSelectedMovieModal(movie)}
              >
                <Image source={{ uri: movie.poster }} style={styles.gridPoster} />
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {movie.rating}</Text>
                </View>
                <Text style={styles.gridTitle} numberOfLines={1}>{movie.title}</Text>
                <Text style={styles.gridSub}>{movie.year} • {movie.torrents.length} مصادر</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* 3. تبويب الفناء الخلفي (إدارة التورنت والمحرك الحي) */}
      {activeTab === 'downloads' && (
        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
          {/* إدخال روابط الماجنيت مباشرة */}
          <View style={styles.magnetBox}>
            <Text style={styles.magnetTitle}>🧲 إضافة تورنت عبر رابط Magnet / Hash</Text>
            <View style={styles.magnetInputRow}>
              <TextInput 
                placeholder="إلصق رابط magnet:?xt=urn:btih..." 
                placeholderTextColor="#64748b"
                style={styles.magnetInput}
                value={magnetInput}
                onChangeText={setMagnetInput}
              />
              <TouchableOpacity style={styles.addMagnetBtn} onPress={addTorrentFromMagnet}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>سحب ⚡</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* عدادات وعواكس السرعة الحية */}
          <View style={styles.speedDashboard}>
            <View style={styles.speedCard}>
              <Text style={styles.speedLabel}>⬇️ السرعة الإجمالية</Text>
              <Text style={styles.speedValue}>28.4 <Text style={styles.unit}>MB/s</Text></Text>
            </View>
            <View style={styles.speedCard}>
              <Text style={styles.speedLabel}>🟢 المتصلون (Peers)</Text>
              <Text style={styles.speedValue}>1,162 <Text style={styles.unit}>Seeders</Text></Text>
            </View>
          </View>

          <Text style={styles.sectionHeader}>⚡ التحميلات والعمليات الحية (الفناء الخلفي)</Text>

          {downloads.map((item) => (
            <View key={item.id} style={styles.torrentTaskCard}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <Text style={styles.taskTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.taskStatusText, { color: item.status === 'completed' ? '#10b981' : '#38bdf8' }]}>
                  {item.status === 'completed' ? 'مكتمل ✅' : item.speed}
                </Text>
              </View>

              {/* شريط التقدم النيون */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: item.status === 'completed' ? '#10b981' : '#e11d48' }]} />
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center'}}>
                <Text style={styles.taskMeta}>حجم: {item.size} | مكتمل: {item.progress}%</Text>
                <Text style={styles.taskMeta}>🟢 Seeds: {item.seeds}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* 4. تبويب المشغل والإعدادات المتقدمة */}
      {activeTab === 'settings' && (
        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.settingsGroup}>
            <Text style={styles.settingsGroupTitle}>🛠️ إعدادات محرك P2P والشبكة</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>حفظ الملفات تلقائياً</Text>
              <Text style={styles.settingValue}>/Storage/Torrente/</Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>منفذ الاتصال (Port)</Text>
              <Text style={styles.settingValue}>6881 (مفتوح)</Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>تشفير حركة المرور (Protocol Encryption)</Text>
              <Text style={{color: '#10b981', fontWeight: 'bold'}}>إجباري 🔒</Text>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>حد سرعة السحب</Text>
              <Text style={styles.settingValue}>غير محدود ♾️</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* 5. شاشة التفاصيل والتحميل الاحترافية (Modal) */}
      {selectedMovieModal && (
        <Modal animationType="slide" transparent={true} visible={!!selectedMovieModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeModalBtn} onPress={() => setSelectedMovieModal(null)}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>✕</Text>
              </TouchableOpacity>

              <Image source={{ uri: selectedMovieModal.poster }} style={styles.modalPoster} />
              <Text style={styles.modalTitle}>{selectedMovieModal.title}</Text>
              <Text style={styles.modalDesc}>{selectedMovieModal.description}</Text>

              <Text style={styles.modalTorrentsTitle}>اختر نسخة التورنت للسحب المباشر:</Text>

              <ScrollView style={{maxHeight: 200}}>
                {selectedMovieModal.torrents.map((torrent) => (
                  <View key={torrent.id} style={styles.torrentLinkRow}>
                    <View style={{flex: 1}}>
                      <Text style={styles.torrentQualityBadge}>{torrent.quality}</Text>
                      <Text style={styles.torrentAudioText}>{torrent.audio}</Text>
                      <Text style={styles.torrentStats}>الحجم: {torrent.size} • 🟢 {torrent.seeders} Seeders</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.modalDownloadBtn}
                      onPress={() => startDownloadFromCatalog(torrent, selectedMovieModal)}
                    >
                      <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>⚡ سحب</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* 6. شريط التنقل السفلي الاحترافي */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Text style={{fontSize: 20}}>🎬</Text>
          <Text style={[styles.navLabel, activeTab === 'home' && styles.activeNavLabel]}>المعرض</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('downloads')}>
          <Text style={{fontSize: 20}}>⚡</Text>
          <Text style={[styles.navLabel, activeTab === 'downloads' && styles.activeNavLabel]}>الفناء الخلفي ({downloads.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('settings')}>
          <Text style={{fontSize: 20}}>⚙️</Text>
          <Text style={[styles.navLabel, activeTab === 'settings' && styles.activeNavLabel]}>المحرك</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080c14' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  brandContainer: { flexDirection: 'row', alignItems: 'center' },
  brandBadge: { backgroundColor: '#e11d48', padding: 6, borderRadius: 10, marginRight: 10 },
  brandIcon: { fontSize: 18 },
  brandTitle: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  proTag: { fontSize: 10, backgroundColor: '#2563eb', color: '#fff', paddingHorizontal: 4, borderRadius: 4 },
  brandSub: { color: '#64748b', fontSize: 10 },
  engineStatus: { backgroundColor: '#022c22', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#059669', flexDirection: 'row', alignItems: 'center' },
  engineDot: { fontSize: 8, marginRight: 4 },
  engineText: { color: '#10b981', fontSize: 10, fontWeight: 'bold' },
  mainScroll: { flex: 1, padding: 16 },
  searchSection: { marginBottom: 14 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 14, borderRadius: 14, height: 48, borderWidth: 1, borderColor: '#334155' },
  searchInput: { color: '#fff', flex: 1, textAlign: 'right' },
  filterBar: { marginBottom: 20 },
  filterChip: { backgroundColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  activeFilterChip: { backgroundColor: '#e11d48' },
  filterText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  activeFilterText: { color: '#fff' },
  heroSection: { height: 220, borderRadius: 18, overflow: 'hidden', marginBottom: 24, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(8, 12, 20, 0.85)', padding: 14 },
  heroBadge: { color: '#fbbf24', fontSize: 11, fontWeight: 'bold', marginBottom: 2 },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  heroMeta: { color: '#94a3b8', fontSize: 11, marginBottom: 8 },
  heroButton: { backgroundColor: '#e11d48', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, alignSelf: 'flex-start' },
  heroButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  sectionHeader: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 14 },
  movieGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: (width - 44) / 2, backgroundColor: '#1e293b', borderRadius: 14, padding: 8, marginBottom: 14, position: 'relative' },
  gridPoster: { width: '100%', height: 200, borderRadius: 10 },
  ratingBadge: { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  gridTitle: { color: '#fff', fontWeight: 'bold', marginTop: 8, fontSize: 13 },
  gridSub: { color: '#64748b', fontSize: 11 },
  magnetBox: { backgroundColor: '#1e293b', padding: 14, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  magnetTitle: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  magnetInputRow: { flexDirection: 'row', gap: 8 },
  magnetInput: { flex: 1, backgroundColor: '#0f172a', color: '#fff', borderRadius: 8, paddingHorizontal: 10, fontSize: 12, textAlign: 'right' },
  addMagnetBtn: { backgroundColor: '#2563eb', paddingHorizontal: 14, justifyContent: 'center', borderRadius: 8 },
  speedDashboard: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  speedCard: { flex: 1, backgroundColor: '#0f172a', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#1e293b' },
  speedLabel: { color: '#94a3b8', fontSize: 11, marginBottom: 4 },
  speedValue: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  unit: { fontSize: 12, color: '#e11d48' },
  torrentTaskCard: { backgroundColor: '#1e293b', padding: 14, borderRadius: 14, marginBottom: 12 },
  taskTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13, flex: 1 },
  taskStatusText: { fontWeight: 'bold', fontSize: 12 },
  progressTrack: { height: 6, backgroundColor: '#0f172a', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%' },
  taskMeta: { color: '#64748b', fontSize: 11 },
  settingsGroup: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16 },
  settingsGroupTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 12 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#334155' },
  settingText: { color: '#cbd5e1', fontSize: 13 },
  settingValue: { color: '#94a3b8', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#0f172a', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#334155', position: 'relative' },
  closeModalBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: '#334155', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  modalPoster: { width: 90, height: 130, borderRadius: 10, alignSelf: 'center', marginBottom: 10 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  modalDesc: { color: '#94a3b8', fontSize: 11, textAlign: 'center', marginVertical: 8 },
  modalTorrentsTitle: { color: '#e11d48', fontSize: 12, fontWeight: 'bold', marginTop: 10, marginBottom: 8 },
  torrentLinkRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 10, borderRadius: 10, marginBottom: 8 },
  torrentQualityBadge: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  torrentAudioText: { color: '#38bdf8', fontSize: 11 },
  torrentStats: { color: '#64748b', fontSize: 10 },
  modalDownloadBtn: { backgroundColor: '#e11d48', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#0f172a', height: 60, borderTopWidth: 1, borderTopColor: '#1e293b' },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navLabel: { fontSize: 10, color: '#64748b', fontWeight: 'bold', marginTop: 2 },
  activeNavLabel: { color: '#e11d48' }
});
