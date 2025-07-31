import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import DatePicker from "@/components/DatePicker";
import { updateTrip } from "@/lib/trips";
import useAuthStore from "@/store/auth.store";
import useTripsStore from "@/store/trips.store";
import { Currency, TripFormData } from "@/type";
import { formatDateForDB } from "@/utils/helpers";
import { currencies } from "@/variables";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View, Alert, TouchableOpacity, Platform } from "react-native";

const EditTrip = () => {
  const { tripId } = useLocalSearchParams();
  const { trips, fetchTrips } = useTripsStore();
  const { user } = useAuthStore();

  const trip = trips.find((t) => t.$id === tripId);

  const initialData: TripFormData = {
    name: trip?.name || "",
    startDate: trip?.dateStart ? new Date(trip.dateStart) : new Date(),
    endDate: trip?.dateEnd ? new Date(trip.dateEnd) : new Date(),
    defaultCurrency: trip?.defaultCurrency || "EUR",
  };

  const [formData, setFormData] = useState<TripFormData>(initialData);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDataChanged = (initial: TripFormData, current: TripFormData) => {
    return (
      initial.name !== current.name ||
      initial.startDate.getTime() !== current.startDate.getTime() ||
      initial.endDate.getTime() !== current.endDate.getTime() ||
      initial.defaultCurrency !== current.defaultCurrency
    );
  };

  // Generic updater function
  const updateField = <K extends keyof TripFormData>(
    field: K,
    value: TripFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async () => {
    const { name, startDate, endDate, defaultCurrency } = formData;

    const tripEditData = {
      name: name.trim(),
      dateStart: formatDateForDB(startDate),
      dateEnd: formatDateForDB(endDate),
      defaultCurrency: defaultCurrency,
    };

    // Check if data has changed
    if (!isDataChanged(initialData, formData)) {
      Alert.alert("No changes detected", "Nothing to update.");
      return;
    }

    if (!name.trim()) {
      return Alert.alert("Error", "Please enter trip name");
    }

    setIsSubmitting(true);
    try {
      await updateTrip(tripId as string, tripEditData);
      await fetchTrips(user!.$id as string);

      Alert.alert("Trip updated successfully!");
      router.back();
      //console.log("Trip Updated:", tripData);
    } catch (error: any) {
      console.error("Updating Trip Error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View
      className="flex gap-4 bg-white  p-5 mt-3"
      style={{ marginBottom: Platform.OS === "ios" ? 20 : 50 }}
    >
      <CustomInput
        placeholder="Enter new trip name"
        value={formData.name}
        label="Trip Name"
        onChangeText={(text) => updateField("name", text)}
      />

      <View>
        <Text className="label">Start date</Text>
        <DatePicker
          value={formData.startDate}
          onDateChange={(date) => updateField("startDate", date)}
        />
      </View>

      <View>
        <Text className="label">End date</Text>
        <DatePicker
          value={formData.endDate}
          onDateChange={(date) => updateField("endDate", date)}
          minimumDate={formData.startDate}
        />
      </View>

      <View className="flex">
        <Text className="label">Trip currency</Text>
        <View className="w-full flex flex-row gap-2 flex-wrap">
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency.value}
              onPress={() =>
                updateField("defaultCurrency", currency.value as Currency)
              }
              className={`w-[23%] h-12  ${
                formData.defaultCurrency === currency.value
                  ? "border-2 border-secondary"
                  : "border border-gray-300"
              } rounded-xl flex items-center justify-center`}
            >
              <Text numberOfLines={1} ellipsizeMode="tail">
                {currency.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <CustomButton
        text="Save Changes"
        onPress={() => {
          submit();
        }}
        isLoading={isSubmitting}
        whileLoadingText="Saving..."
      />
    </View>
  );
};

export default EditTrip;
