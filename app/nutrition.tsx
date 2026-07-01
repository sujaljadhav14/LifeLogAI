import { ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/context/data-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function NutritionScreen() {
  const colors = useColors();
  const { dataService } = useData();
  const router = useRouter();
  const [time, setTime] = useState('');
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const meals = dataService.getMealsByDate(today);
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

  const handleAddMeal = async () => {
    if (!time || !mealName) {
      alert('Please fill in time and meal name');
      return;
    }

    try {
      await dataService.addMeal({
        date: today,
        time,
        name: mealName,
        calories: calories ? parseInt(calories) : undefined,
        protein: protein ? parseInt(protein) : undefined,
        notes: notes || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTime('');
      setMealName('');
      setCalories('');
      setProtein('');
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add meal:', error);
      alert('Failed to add meal');
    }
  };

  const handleDeleteMeal = async (id: string) => {
    try {
      await dataService.deleteMeal(id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to delete meal:', error);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">Nutrition Log</Text>
              <Text className="text-sm text-muted">Track your meals</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Daily Summary */}
          <View className="bg-surface rounded-2xl p-4 gap-2 border border-border">
            <Text className="text-sm text-muted">Today's Summary</Text>
            <View className="flex-row justify-between">
              <View className="gap-1">
                <Text className="text-2xl font-bold text-primary">{totalCalories}</Text>
                <Text className="text-xs text-muted">Total Calories</Text>
              </View>
              <View className="gap-1">
                <Text className="text-2xl font-bold text-primary">{meals.length}</Text>
                <Text className="text-xs text-muted">Meals Logged</Text>
              </View>
            </View>
          </View>

          {/* Add Meal Form */}
          {showForm && (
            <View className="bg-surface rounded-2xl p-4 gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Add Meal</Text>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Time</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="HH:MM"
                  placeholderTextColor={colors.muted}
                  value={time}
                  onChangeText={setTime}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Meal Name</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="e.g., Breakfast"
                  placeholderTextColor={colors.muted}
                  value={mealName}
                  onChangeText={setMealName}
                />
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 gap-2">
                  <Text className="text-sm font-semibold text-foreground">Calories</Text>
                  <TextInput
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholder="Optional"
                    placeholderTextColor={colors.muted}
                    keyboardType="number-pad"
                    value={calories}
                    onChangeText={setCalories}
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Text className="text-sm font-semibold text-foreground">Protein (g)</Text>
                  <TextInput
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholder="Optional"
                    placeholderTextColor={colors.muted}
                    keyboardType="number-pad"
                    value={protein}
                    onChangeText={setProtein}
                  />
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Notes</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground min-h-[80px]"
                  placeholder="Add notes..."
                  placeholderTextColor={colors.muted}
                  multiline
                  value={notes}
                  onChangeText={setNotes}
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
                  onPress={handleAddMeal}
                  className="flex-1 bg-primary rounded-lg py-3"
                >
                  <Text className="text-center font-semibold text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Meals List */}
          <View className="gap-3">
            {meals.length > 0 ? (
              meals.map(meal => (
                <View key={meal.id} className="bg-surface rounded-lg p-4 border border-border">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 gap-1">
                      <View className="flex-row gap-2 items-center">
                        <Text className="text-sm font-semibold text-primary">{meal.time}</Text>
                        <Text className="text-sm font-semibold text-foreground">{meal.name}</Text>
                      </View>
                      {meal.notes && <Text className="text-xs text-muted">{meal.notes}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteMeal(meal.id)}>
                      <Text className="text-error font-semibold text-xs">Delete</Text>
                    </TouchableOpacity>
                  </View>
                  {(meal.calories || meal.protein) && (
                    <View className="flex-row gap-4 text-xs text-muted">
                      {meal.calories && <Text className="text-xs text-muted">{meal.calories} cal</Text>}
                      {meal.protein && <Text className="text-xs text-muted">{meal.protein}g protein</Text>}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted">No meals logged yet</Text>
              </View>
            )}
          </View>

          {/* Add Button */}
          {!showForm && (
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              className="bg-primary rounded-lg py-4 items-center mt-4"
            >
              <Text className="text-white font-semibold">+ Add Meal</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
