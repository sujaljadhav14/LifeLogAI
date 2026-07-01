import { ScrollView, Text, View, TouchableOpacity, TextInput, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/context/data-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { ActivityCategory } from '@/types';

const ACTIVITY_CATEGORIES: ActivityCategory[] = ['workout', 'meal', 'study', 'work', 'reading', 'walking', 'meditation', 'custom'];

export default function ActivitiesScreen() {
  const colors = useColors();
  const { dataService } = useData();
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('workout');
  const [customCategory, setCustomCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const activities = dataService.getActivitiesByDate(today);
  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : activities.filter(a => a.category === selectedCategory);

  const handleAddActivity = async () => {
    if (!time || !category) {
      alert('Please fill in time and category');
      return;
    }

    try {
      await dataService.addActivity({
        date: today,
        time,
        category,
        customCategory: category === 'custom' ? customCategory : undefined,
        notes: notes || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTime('');
      setCategory('workout');
      setCustomCategory('');
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add activity:', error);
      alert('Failed to add activity');
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await dataService.deleteActivity(id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Activities</Text>
            <Text className="text-sm text-muted">Log your daily activities</Text>
          </View>

          {/* Category Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
            <TouchableOpacity
              onPress={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === 'all' ? 'bg-primary' : 'bg-surface border border-border'
              }`}
            >
              <Text className={`font-semibold ${selectedCategory === 'all' ? 'text-white' : 'text-foreground'}`}>
                All
              </Text>
            </TouchableOpacity>
            {ACTIVITY_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === cat ? 'bg-primary' : 'bg-surface border border-border'
                }`}
              >
                <Text className={`font-semibold capitalize ${selectedCategory === cat ? 'text-white' : 'text-foreground'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Add Activity Form */}
          {showForm && (
            <View className="bg-surface rounded-2xl p-4 gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Add Activity</Text>

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
                <Text className="text-sm font-semibold text-foreground">Category</Text>
                <View className="gap-2">
                  {ACTIVITY_CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`p-3 rounded-lg border ${
                        category === cat ? 'bg-primary border-primary' : 'bg-background border-border'
                      }`}
                    >
                      <Text className={`font-semibold capitalize ${category === cat ? 'text-white' : 'text-foreground'}`}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {category === 'custom' && (
                <View className="gap-2">
                  <Text className="text-sm font-semibold text-foreground">Custom Category</Text>
                  <TextInput
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholder="Enter custom category"
                    placeholderTextColor={colors.muted}
                    value={customCategory}
                    onChangeText={setCustomCategory}
                  />
                </View>
              )}

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Notes (optional)</Text>
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
                  onPress={handleAddActivity}
                  className="flex-1 bg-primary rounded-lg py-3"
                >
                  <Text className="text-center font-semibold text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Activities List */}
          <View className="gap-3">
            {filteredActivities.length > 0 ? (
              filteredActivities.map(activity => (
                <View key={activity.id} className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-start">
                  <View className="flex-1 gap-1">
                    <View className="flex-row gap-2 items-center">
                      <Text className="text-sm font-semibold text-primary">{activity.time}</Text>
                      <Text className="text-sm font-semibold text-foreground capitalize">{activity.category}</Text>
                    </View>
                    {activity.notes && <Text className="text-xs text-muted">{activity.notes}</Text>}
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteActivity(activity.id)}
                    className="ml-4"
                  >
                    <Text className="text-error font-semibold">Delete</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted">No activities logged yet</Text>
              </View>
            )}
          </View>

          {/* Add Button */}
          {!showForm && (
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              className="bg-primary rounded-lg py-4 items-center mt-4"
            >
              <Text className="text-white font-semibold">+ Add Activity</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
