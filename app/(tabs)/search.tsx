import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, Image, Animated } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";

import MovieDisplayCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import SearchBar from "@/components/Searchbar";
import {updateSearchCount} from "@/services/appwrite";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const fadeAnim = new Animated.Value(0);

    const {
        data: movies = [],
        loading,
        error,
        refetch: loadMovies,
        reset,
    } = useFetch(() => fetchMovies({ query: searchQuery }), false);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();

                // @ts-ignore
                if (movies?.length > 0 && movies?.[0])
                    await updateSearchCount(searchQuery, movies[0]);
            } else {
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        if (movies?.length > 0 && movies?.[0]) {
            updateSearchCount(searchQuery, movies[0]);
        }
    }, [movies]);

    // Fade-in animation when results are displayed
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: (movies?.length ?? 0) > 0 ? 1 : 0,  // Ensure movies is not null
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [movies]);

    // @ts-ignore
    return (
        <View className="flex-1 bg-primary">
            {/* Background Image */}
            <Image source={images.bg} className="absolute w-full h-full z-0 opacity-40" resizeMode="cover" />

            <FlatList
                className="px-5"
                data={movies as Movie[]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieDisplayCard {...item} />}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginVertical: 12,
                }}
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center mt-16 items-center">
                            <Image source={icons.logo} className="w-14 h-12 opacity-90" />
                        </View>

                        {/* Search Bar */}
                        <View className="mt-5">
                            <SearchBar
                                placeholder="Search for movies..."
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                        </View>

                        {/* Loading Indicator */}
                        {loading && (
                            <ActivityIndicator size="large" color="#ab8bff" className="mt-5" />
                        )}

                        {/* Error Message */}
                        {error && (
                            <Text className="text-red-400 px-5 mt-3 text-center">
                                Error: {error.message}
                            </Text>
                        )}

                        {/* Search Results Header */}
                        {!loading && !error && searchQuery.trim() && (movies?.length ?? 0) > 0 && (
                            <Animated.Text
                                style={{ opacity: fadeAnim }}
                                className="text-lg text-white font-semibold mt-5"
                            >
                                Results for <Text className="text-accent">{searchQuery}</Text>
                            </Animated.Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error && (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-400">
                                {searchQuery.trim() ? "No movies found 😕" : "Start typing to search 🎬"}
                            </Text>
                        </View>
                    )
                }
            />
        </View>
    );
};

export default Search;