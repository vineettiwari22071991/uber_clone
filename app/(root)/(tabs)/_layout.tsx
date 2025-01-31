import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

const TabIcon = ({ source, focused }: { source: ImageSourcePropType; focused: boolean }) => (
  <View
    className={`flex flex-row justify-center items-center rounded-full ${
      focused ? "bg-general-300" : ""
    }`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${
        focused ? "bg-general-400" : ""
      }`}
    >
      <Image source={source} tintColor="white" resizeMode="contain" className="w-7 h-7" />
    </View>
  </View>
);

const Layout = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "white",
          tabBarStyle: {
            backgroundColor: "#333333",
            borderRadius: 50,
            paddingBottom: 0,
            overflow: "hidden",
            marginHorizontal: 20,
            marginBottom: isKeyboardVisible ? -60 : 20, // Hide tab bar when keyboard is visible
            height: 60,
            display: isKeyboardVisible ? "none" : "flex", // Hide when keyboard is open
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.home} />,
          }}
        />

        <Tabs.Screen
          name="rides"
          options={{
            title: "Rides",
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.list} />,
          }}
        />

        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.chat} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.profile} />,
          }}
        />
      </Tabs>
    </KeyboardAvoidingView>
  );
};

export default Layout;
