import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet } from "react-native";
import { useDriverStore, useLocationStore } from "@/store";
import { calculateDriverTimes, calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useEffect, useState } from "react";
import { Driver, MarkerData } from "@/types/type";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import MapViewDirections from "react-native-maps-directions";


const directionsAPI = process.env.EXPO_PUBLIC_PLACES_API_KEY;

const Map = () => {
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver")
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude
  } = useLocationStore()

  const { selectedDriver, setDrivers } = useDriverStore()

  const [markers, setMarkers] = useState<MarkerData[]>([])

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  })

  useEffect(() => {

    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return

      const newMarkers = generateMarkersFromData(
        {
          data: drivers,
          userLatitude,
          userLongitude
        })

      setMarkers(newMarkers)
    }

  }, [drivers, userLatitude, userLongitude])

  useEffect(() => {
    if (markers.length > 0 && destinationLatitude &&
      destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[])
      })
    }
  }, [markers, destinationLatitude, destinationLongitude])
  if (loading || (!userLatitude || !userLongitude)) return (
    <View className="flex justify-between items-center w-full">
      <ActivityIndicator size="small" color="#000" />
    </View>
  )

  if (error) return (
    <View className="flex justify-between items-center w-full">
      <Text>Error: {error}</Text>
    </View>
  )


  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_DEFAULT}
        tintColor="black"
        style={styles.map}
        showsPointsOfInterest={false}
        initialRegion={region}
        //showsUserLocation={true}
        userInterfaceStyle="light"
      >
        {
          markers.map((marker) => {
            return (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude
                }}
                title={marker.title}
                image={
                  selectedDriver === marker.id ? icons.selectedMarker : icons.marker
                }
              />
            )
          })
        }

{destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={directionsAPI!}
            strokeColor="#0286FF"
            strokeWidth={2}
          />
        </>
      )}

      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1, // Takes full width & height of the container
  },
});

export default Map;
