import { ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/context/data-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function JournalScreen() {
  const colors = useColors();
  const { dataService } = useData();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [viewingPastEntry, setViewingPastEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = dataService.getJournalEntryByDate(today);
  const allEntries = dataService.getAllJournalEntries();

  useEffect(() => {
    if (todayEntry) {
      setContent(todayEntry.content);
    }
  }, [todayEntry]);

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Please write something in your journal');
      return;
    }

    try {
      if (todayEntry) {
        await dataService.updateJournalEntry(todayEntry.id, { content });
      } else {
        await dataService.addJournalEntry({
          date: today,
          content,
        });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      alert('Failed to save journal entry');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await dataService.deleteJournalEntry(id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setViewingPastEntry(false);
      setSelectedEntry(null);
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  if (viewingPastEntry && selectedEntry) {
    return (
      <ScreenContainer className="p-0">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 p-6 gap-4">
            {/* Header */}
            <View className="flex-row justify-between items-center">
              <View className="gap-1">
                <Text className="text-3xl font-bold text-foreground">Journal Entry</Text>
                <Text className="text-sm text-muted">{selectedEntry.date}</Text>
              </View>
              <TouchableOpacity onPress={() => setViewingPastEntry(false)}>
                <MaterialIcons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {/* Entry Content */}
            <View className="bg-surface rounded-2xl p-4 border border-border gap-3 flex-1">
              <Text className="text-base text-foreground leading-relaxed">{selectedEntry.content}</Text>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => handleDeleteEntry(selectedEntry.id)}
              className="bg-error rounded-lg py-4 items-center"
            >
              <Text className="text-white font-semibold">Delete Entry</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">Daily Journal</Text>
              <Text className="text-sm text-muted">Reflect on your day</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Today's Entry */}
          <View className="gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-foreground">Today's Entry</Text>
              <Text className="text-xs text-muted">{content.length} characters</Text>
            </View>
            <TextInput
              className="bg-surface border border-border rounded-2xl px-4 py-4 text-foreground min-h-[300px]"
              placeholder="Write your thoughts and reflections..."
              placeholderTextColor={colors.muted}
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-primary rounded-lg py-4 items-center"
          >
            <Text className="text-white font-semibold">Save Entry</Text>
          </TouchableOpacity>

          {/* Success Message */}
          {saved && (
            <View className="bg-success rounded-lg p-4 items-center">
              <Text className="text-white font-semibold">Entry saved successfully!</Text>
            </View>
          )}

          {/* Past Entries */}
          {allEntries.length > 1 && (
            <View className="gap-3 mt-4">
              <Text className="text-lg font-semibold text-foreground">Past Entries</Text>
              {allEntries.filter(e => e.date !== today).map(entry => (
                <TouchableOpacity
                  key={entry.id}
                  onPress={() => {
                    setSelectedEntry(entry);
                    setViewingPastEntry(true);
                  }}
                  className="bg-surface rounded-lg p-4 border border-border"
                >
                  <View className="gap-2">
                    <Text className="text-sm font-semibold text-foreground">{entry.date}</Text>
                    <Text className="text-xs text-muted line-clamp-2">{entry.content}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
