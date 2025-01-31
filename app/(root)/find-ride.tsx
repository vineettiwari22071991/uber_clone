import GoogleTextInput from "@/components/GoogleTextInput"
import RideLayout from "@/components/RideLayout"
import { icons } from "@/constants"
import { useLocationStore } from "@/store"
import { Text, View } from "react-native"
import '../../global.css'
import CustomButton from "@/components/CustomButton"
import { router } from "expo-router"

const FindRide = () => {
    const {
        userAddress,
        destinationAddress,
        setDestinationLocation,
        setUserLocation
    } = useLocationStore()
    console.log("User Address", userAddress)
    return (
    <RideLayout title="Ride" snapPoints={["50%"]}>

       
       <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>
        <GoogleTextInput 
        icon={icons.target}
        initialLocation={userAddress!}
        containerStyle="white"
        textInputBackgroundColor="transparent"
        handlePress={(location)=>setUserLocation(location)}
        />
       </View>

       <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>
        <GoogleTextInput 
        icon={icons.map}
        initialLocation={destinationAddress!}
        containerStyle="white"
        textInputBackgroundColor="transparent"
        handlePress={(location)=>setDestinationLocation(location)}
        />
       </View>

       <CustomButton
       title="Find now"
       onPress={()=> router.push("/(root)/confirm-ride")}
       className="mt-10 "
       />

    </RideLayout>
    )
}

export default FindRide