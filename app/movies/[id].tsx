import {
    View,
    Text,
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Linking,
    StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo } from "react";

import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-light-100 font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);

const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: movie, loading } = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    const formattedReleaseDate = useMemo(() => {
        if (!movie?.release_date) return "N/A";
        const date = new Date(movie.release_date);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }, [movie?.release_date]);

    const openIMDB = () => {
        if (movie?.imdb_id) {
            Linking.openURL(`https://www.imdb.com/title/${movie.imdb_id}`);
        }
    };

    const openHomepage = () => {
        if (movie?.homepage) {
            Linking.openURL(movie.homepage);
        }
    };

    if (loading)
        return (
            <SafeAreaView className="bg-primary flex-1">
                <ActivityIndicator size="large" color="#ffffff" />
            </SafeAreaView>
        );

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Backdrop Image */}
                {movie?.backdrop_path && (
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                        }}
                        className="w-full h-[200px]"
                        resizeMode="cover"
                    />
                )}

                {/* Poster and Basic Info */}
                <View className="flex-row px-5 mt-5">
                    <Image
                        source={{
                            uri: movie?.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : 'https://via.placeholder.com/150x225',
                        }}
                        className="w-[150px] h-[225px] rounded-lg"
                        resizeMode="cover"
                    />

                    <View className="flex-1 ml-4">
                        <Text className="text-white font-bold text-xl">{movie?.title}</Text>
                        {movie?.original_title !== movie?.title && (
                            <Text className="text-light-200 italic text-sm mt-1">
                                ({movie?.original_title})
                            </Text>
                        )}

                        {movie?.tagline && (
                            <Text className="text-accent italic text-sm mt-2">
                                "{movie.tagline}"
                            </Text>
                        )}

                        <View className="flex-row items-center gap-x-1 mt-2">
                            <Text className="text-light-200 text-sm">
                                {movie?.release_date?.split("-")[0] || "N/A"} •
                            </Text>
                            <Text className="text-light-200 text-sm">
                                {movie?.runtime ? `${movie.runtime}m` : "N/A"}
                            </Text>
                        </View>

                        <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-3 self-start">
                            <Image source={icons.star} className="size-4" />
                            <Text className="text-white font-bold text-sm">
                                {movie?.vote_average ? movie.vote_average.toFixed(1) : "0"}/10
                            </Text>
                            <Text className="text-light-200 text-sm">
                                ({movie?.vote_count} votes)
                            </Text>
                        </View>

                        {/* External Links */}
                        <View className="flex-row mt-4 gap-x-2">
                            {movie?.imdb_id && (
                                <TouchableOpacity
                                    className="bg-[#f5c518] py-1 px-3 rounded-md"
                                    onPress={openIMDB}
                                >
                                    <Text className="text-black font-bold text-sm">IMDb</Text>
                                </TouchableOpacity>
                            )}

                            {movie?.homepage && (
                                <TouchableOpacity
                                    className="bg-accent py-1 px-3 rounded-md"
                                    onPress={openHomepage}
                                >
                                    <Text className="text-white font-bold text-sm">Website</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Play Trailer Button */}
                <TouchableOpacity className="bg-accent mx-5 rounded-lg py-3 flex-row items-center justify-center mt-5">
                    <Image
                        source={icons.play}
                        className="w-5 h-5 mr-2"
                        tintColor="#fff"
                    />
                    <Text className="text-white font-semibold text-base">Watch Trailer</Text>
                </TouchableOpacity>

                {/* Details Section */}
                <View className="px-5 mt-5">
                    {/* Overview */}
                    <MovieInfo label="Overview" value={movie?.overview} />

                    {/* Genres */}
                    <View className="mt-5">
                        <Text className="text-light-200 font-normal text-sm">Genres</Text>
                        <View className="flex-row flex-wrap gap-2 mt-2">
                            {movie?.genres?.map((genre) => (
                                <View key={genre.id} className="bg-dark-100 rounded-full px-3 py-1">
                                    <Text className="text-light-100 text-xs">{genre.name}</Text>
                                </View>
                            )) || <Text className="text-light-100 text-sm">N/A</Text>}
                        </View>
                    </View>

                    {/* Release Info */}
                    <MovieInfo label="Release Date" value={formattedReleaseDate} />
                    <MovieInfo label="Status" value={movie?.status} />
                    <MovieInfo label="Original Language" value={
                        movie?.spoken_languages?.find(lang => lang.iso_639_1 === movie.original_language)?.english_name ||
                        movie?.original_language
                    } />

                    {/* Financial Info */}
                    <View className="flex-row justify-between mt-5">
                        <View className="w-[48%]">
                            <Text className="text-light-200 font-normal text-sm">Budget</Text>
                            <Text className="text-light-100 font-bold text-sm mt-2">
                                {movie?.budget ? `$${(movie.budget / 1_000_000).toFixed(1)} million` : "N/A"}
                            </Text>
                        </View>
                        <View className="w-[48%]">
                            <Text className="text-light-200 font-normal text-sm">Revenue</Text>
                            <Text className="text-light-100 font-bold text-sm mt-2">
                                {movie?.revenue ? `$${(movie.revenue / 1_000_000).toFixed(1)} million` : "N/A"}
                            </Text>
                        </View>
                    </View>

                    {/* Collection */}
                    {movie?.belongs_to_collection && (
                        <View className="mt-5 bg-dark-100 rounded-lg p-3">
                            <Text className="text-light-200 font-normal text-sm">Part of Collection</Text>
                            <Text className="text-light-100 font-bold text-sm mt-2">
                                {movie.belongs_to_collection.name}
                            </Text>
                        </View>
                    )}

                    {/* Production Info */}
                    <MovieInfo
                        label="Production Companies"
                        value={movie?.production_companies?.map((c) => c.name).join(" • ") || "N/A"}
                    />

                    <MovieInfo
                        label="Production Countries"
                        value={movie?.production_countries?.map((c) => c.name).join(" • ") || "N/A"}
                    />

                    {/* Age Rating */}
                    <View className="mt-5">
                        <Text className="text-light-200 font-normal text-sm">Age Rating</Text>
                        <View className="mt-2 bg-dark-100 self-start px-2 py-1 rounded-md">
                            <Text className="text-light-100 font-bold text-sm">
                                {movie?.adult ? "Adults Only (18+)" : "Not Adult Rated"}
                            </Text>
                        </View>
                    </View>

                    {/* Popularity */}
                    <MovieInfo label="Popularity Score" value={movie?.popularity?.toFixed(1) || "N/A"} />
                </View>
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
                onPress={router.back}
            >
                <Image
                    source={icons.arrow}
                    className="size-5 mr-1 mt-0.5 rotate-180"
                    tintColor="#fff"
                />
                <Text className="text-white font-semibold text-base">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Details;