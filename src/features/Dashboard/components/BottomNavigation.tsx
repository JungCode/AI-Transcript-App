import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

enum DashBoardPath {
  HOME = '/dashboard/home',
  PODCAST = '/dashboard/podcast',
  SETTING = '/dashboard/setting',
}

const NAVIGATION_TABS: {
  name: string;
  icon: React.ReactNode;
  path: DashBoardPath;
}[] = [
  {
    name: 'Home',
    icon: <Ionicons name="home" size={21} color="#e7e9dd" />,
    path: DashBoardPath.HOME,
  },
  {
    name: 'Podcast',
    icon: <MaterialIcons name="podcasts" size={21} color="#e7e9dd" />,
    path: DashBoardPath.PODCAST,
  },
  {
    name: 'Setting',
    icon: <Ionicons name="settings-sharp" size={21} color="#e7e9dd" />,
    path: DashBoardPath.SETTING,
  },
];

const BottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navigateTo = (path: DashBoardPath) => {
    const currentIndex = getTabIndex(pathname as DashBoardPath);
    const targetIndex = getTabIndex(path);

    if (currentIndex === targetIndex) {
      return;
    }

    // Use replace to avoid stacking screens
    router.replace(path);
  };

  const getTabIndex = (path: DashBoardPath) => {
    if (path === DashBoardPath.HOME) return 0;
    if (path === DashBoardPath.PODCAST) return 1;
    if (path === DashBoardPath.SETTING) return 2;
    return -1;
  };

  return (
    <View className="absolute bottom-10 left-0 right-0">
      <View className="items-center">
        <View
          className="bg-mirai-bgDeep border border-mirai-borderDark rounded-3xl py-3"
          style={{ width: 200 }}
        >
          <View className="flex-row items-center justify-around px-3">
            {NAVIGATION_TABS.map((tab, index) => {
              const isActive = getTabIndex(pathname as DashBoardPath) === index;

              return (
                <TouchableOpacity
                  key={index}
                  className="items-center"
                  onPress={() => navigateTo(tab.path)}
                >
                  <View
                    className={`${isActive ? 'bg-mirai-greenDark' : ''} rounded-md py-1 px-3 items-center justify-center`}
                  >
                    {tab.icon}
                  </View>
                  <Text className="text-text-soft text-sm font-bold font-nunito ">
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

export { BottomNavigation };
