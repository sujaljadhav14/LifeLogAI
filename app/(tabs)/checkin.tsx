import { ScrollView, Text, View, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/context/data-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😄'];

export default function CheckInScreen() {
  const colors = useColors();
  const { dataService } = useData();
  const [checkInType, setCheckInType] = useState<'morning' | 'evening'>('morning');
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState('');
  const [weight, setWeight] = useState('');
  const [mainFocus, setMainFocus] = useState('');
  const [notes, setNotes] = useState('');
  const [showWeight, setShowWeight] = useState(false);
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSave = async () => {
    if (!sleep || !mainFocus) {
      alert('Please fill in sleep duration and main focus');
      return;
    }

    try {
      await dataService.addCheckIn({
        date: today,
        type: checkInType,
        mood,
        energy,
        sleepDuration: parseFloat(sleep),
        weight: showWeight ? parseFloat(weight) : undefined,
        mainFocus,
        notes: notes || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      // Reset form
      setMood(3);
      setEnergy(5);
      setSleep('');
      setWeight('');
      setMainFocus('');
      setNotes('');
    } catch (error) {
      console.error('Failed to save check-in:', error);
      alert('Failed to save check-in');
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Daily Check-in</Text>
            <Text className="text-sm text-muted">How are you feeling today?</Text>
          </View>

          {/* Check-in Type */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Check-in Type</Text>
            <View className="flex-row gap-3">
              {(['morning', 'evening'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setCheckInType(type)}
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    checkInType === type
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text
                    className={`text-center font-semibold capitalize ${
                      checkInType === type ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mood Selector */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Mood</Text>
            <View className="flex-row justify-between gap-2">
              {MOOD_EMOJIS.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setMood((index + 1) as 1 | 2 | 3 | 4 | 5)}
                  className={`flex-1 py-4 rounded-lg border ${
                    mood === index + 1
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  }`}
                >
                  <Text className="text-3xl text-center">{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Energy Level */}
          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm font-semibold text-foreground">Energy Level</Text>
              <Text className="text-sm font-semibold text-primary">{energy} / 10</Text>
            </View>
            <View className="flex-row gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setEnergy(i + 1)}
                  className={`flex-1 h-8 rounded ${energy > i ? 'bg-primary' : 'bg-surface border border-border'}`}
                />
              ))}
            </View>
          </View>

          {/* Sleep Duration */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Sleep Duration (hours)</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="e.g., 8"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              value={sleep}
              onChangeText={setSleep}
            />
          </View>

          {/* Weight Toggle */}
          <View className="flex-row justify-between items-center bg-surface rounded-lg p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">Log Weight</Text>
            <Switch value={showWeight} onValueChange={setShowWeight} />
          </View>

          {/* Weight Input */}
          {showWeight && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Weight</Text>
              <TextInput
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                placeholder="e.g., 70"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          )}

          {/* Main Focus */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Main Focus for Today</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholder="What's your main focus?"
              placeholderTextColor={colors.muted}
              value={mainFocus}
              onChangeText={setMainFocus}
            />
          </View>

          {/* Notes */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Notes (optional)</Text>
            <TextInput
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground min-h-[100px]"
              placeholder="Add any notes..."
              placeholderTextColor={colors.muted}
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-primary rounded-lg py-4 items-center mt-4"
          >
            <Text className="text-white font-semibold text-lg">Save Check-in</Text>
          </TouchableOpacity>

          {/* Success Message */}
          {saved && (
            <View className="bg-success rounded-lg p-4 items-center">
              <Text className="text-white font-semibold">Check-in saved successfully!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
