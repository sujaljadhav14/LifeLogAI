import { ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/context/data-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function WorkoutScreen() {
  const colors = useColors();
  const { dataService } = useData();
  const router = useRouter();
  const [time, setTime] = useState('');
  const [exercise, setExercise] = useState('');
  const [duration, setDuration] = useState('');
  const [setsReps, setSetsReps] = useState('');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const workouts = dataService.getWorkoutsByDate(today);
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);

  const handleAddWorkout = async () => {
    if (!time || !exercise || !duration) {
      alert('Please fill in time, exercise, and duration');
      return;
    }

    try {
      await dataService.addWorkout({
        date: today,
        time,
        exercise,
        duration: parseInt(duration),
        setsReps: setsReps || undefined,
        notes: notes || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTime('');
      setExercise('');
      setDuration('');
      setSetsReps('');
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add workout:', error);
      alert('Failed to add workout');
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await dataService.deleteWorkout(id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">Workout Log</Text>
              <Text className="text-sm text-muted">Track your exercises</Text>
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
                <Text className="text-2xl font-bold text-primary">{totalDuration}</Text>
                <Text className="text-xs text-muted">Total Minutes</Text>
              </View>
              <View className="gap-1">
                <Text className="text-2xl font-bold text-primary">{workouts.length}</Text>
                <Text className="text-xs text-muted">Workouts</Text>
              </View>
            </View>
          </View>

          {/* Add Workout Form */}
          {showForm && (
            <View className="bg-surface rounded-2xl p-4 gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Add Workout</Text>

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
                <Text className="text-sm font-semibold text-foreground">Exercise</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="e.g., Running"
                  placeholderTextColor={colors.muted}
                  value={exercise}
                  onChangeText={setExercise}
                />
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 gap-2">
                  <Text className="text-sm font-semibold text-foreground">Duration (min)</Text>
                  <TextInput
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholder="30"
                    placeholderTextColor={colors.muted}
                    keyboardType="number-pad"
                    value={duration}
                    onChangeText={setDuration}
                  />
                </View>
                <View className="flex-1 gap-2">
                  <Text className="text-sm font-semibold text-foreground">Sets/Reps</Text>
                  <TextInput
                    className="bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    placeholder="3x10"
                    placeholderTextColor={colors.muted}
                    value={setsReps}
                    onChangeText={setSetsReps}
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
                  onPress={handleAddWorkout}
                  className="flex-1 bg-primary rounded-lg py-3"
                >
                  <Text className="text-center font-semibold text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Workouts List */}
          <View className="gap-3">
            {workouts.length > 0 ? (
              workouts.map(workout => (
                <View key={workout.id} className="bg-surface rounded-lg p-4 border border-border">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1 gap-1">
                      <View className="flex-row gap-2 items-center">
                        <Text className="text-sm font-semibold text-primary">{workout.time}</Text>
                        <Text className="text-sm font-semibold text-foreground">{workout.exercise}</Text>
                      </View>
                      <View className="flex-row gap-4">
                        <Text className="text-xs text-muted">{workout.duration} min</Text>
                        {workout.setsReps && <Text className="text-xs text-muted">{workout.setsReps}</Text>}
                      </View>
                      {workout.notes && <Text className="text-xs text-muted mt-1">{workout.notes}</Text>}
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteWorkout(workout.id)}>
                      <Text className="text-error font-semibold text-xs">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center py-8">
                <Text className="text-muted">No workouts logged yet</Text>
              </View>
            )}
          </View>

          {/* Add Button */}
          {!showForm && (
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              className="bg-primary rounded-lg py-4 items-center mt-4"
            >
              <Text className="text-white font-semibold">+ Add Workout</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
