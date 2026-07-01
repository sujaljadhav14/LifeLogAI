import { ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/context/data-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

export default function HabitsScreen() {
  const colors = useColors();
  const { dataService } = useData();
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const habits = dataService.getAllHabits();

  const handleAddHabit = async () => {
    if (!habitName) {
      alert('Please enter a habit name');
      return;
    }

    try {
      await dataService.addHabit({
        name: habitName,
        description: habitDescription || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setHabitName('');
      setHabitDescription('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add habit:', error);
      alert('Failed to add habit');
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      await dataService.toggleHabitCompletion(habitId, today);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to toggle habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await dataService.deleteHabit(habitId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Habits</Text>
            <Text className="text-sm text-muted">Track your daily habits</Text>
          </View>

          {/* Add Habit Form */}
          {showForm && (
            <View className="bg-surface rounded-2xl p-4 gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Add New Habit</Text>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Habit Name</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="e.g., Drink water"
                  placeholderTextColor={colors.muted}
                  value={habitName}
                  onChangeText={setHabitName}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Description (optional)</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground min-h-[80px]"
                  placeholder="Add description..."
                  placeholderTextColor={colors.muted}
                  multiline
                  value={habitDescription}
                  onChangeText={setHabitDescription}
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowForm(false)}
                  className="flex-1 bg-surface border border-border rounded-lg py-3"
                >
                  <Text className="text-center font-semibold text-foreground">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddHabit}
                  className="flex-1 bg-primary rounded-lg py-3"
                >
                  <Text className="text-center font-semibold text-white">Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Habits List */}
          <View className="gap-3">
            {habits.length > 0 ? (
              habits.map(habit => {
                const isCompleted = dataService.isHabitCompletedOnDate(habit.id, today);
                const streak = dataService.getHabitStreak(habit.id);
                const weekProgress = dataService.getHabitWeekProgress(habit.id);

                return (
                  <TouchableOpacity
                    key={habit.id}
                    onPress={() => handleToggleHabit(habit.id)}
                    className={`rounded-2xl p-4 border ${
                      isCompleted
                        ? 'bg-success/10 border-success'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <View className="gap-3">
                      {/* Habit Header */}
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 gap-1">
                          <View className="flex-row items-center gap-2">
                            <View
                              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                                isCompleted
                                  ? 'bg-success border-success'
                                  : 'border-border'
                              }`}
                            >
                              {isCompleted && <Text className="text-white font-bold">✓</Text>}
                            </View>
                            <Text className={`font-semibold ${isCompleted ? 'text-success' : 'text-foreground'}`}>
                              {habit.name}
                            </Text>
                          </View>
                          {habit.description && (
                            <Text className="text-xs text-muted ml-8">{habit.description}</Text>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDeleteHabit(habit.id)}
                          className="ml-4"
                        >
                          <Text className="text-error font-semibold text-xs">Delete</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Streak and Progress */}
                      <View className="flex-row justify-between items-center ml-8 gap-2">
                        <View className="gap-1">
                          <Text className="text-xs text-muted">Streak</Text>
                          <Text className="text-lg font-bold text-primary">{streak} days</Text>
                        </View>

                        {/* Week Progress */}
                        <View className="flex-row gap-1">
                          {weekProgress.map((completed, index) => (
                            <View
                              key={index}
                              className={`w-6 h-6 rounded ${
                                completed ? 'bg-success' : 'bg-surface border border-border'
                              }`}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted">No habits yet. Create one to get started!</Text>
              </View>
            )}
          </View>

          {/* Add Button */}
          {!showForm && (
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              className="bg-primary rounded-lg py-4 items-center mt-4"
            >
              <Text className="text-white font-semibold">+ Add Habit</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
