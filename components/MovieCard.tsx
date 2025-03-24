import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { icons } from "@/constants/icons";

const genreMap: Record<number, string> = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
    53: "Thriller", 10752: "War", 37: "Western"
};

const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-400";
    if (rating >= 2) return "text-yellow-400";
    return "text-red-400";
};

const MovieCard = ({
                       id, title, poster_path, vote_average, release_date, genre_ids,
                       original_language, popularity, overview, adult
                   }: Movie) => {
    const rating = Math.round(vote_average / 2);
    const genres = genre_ids.map(id => genreMap[id]).filter(Boolean).join(", ");

    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity
                className="w-[48%] bg-gray-900 p-3 rounded-lg shadow-lg"
                activeOpacity={0.8}
            >
                <Image
                    source={{
                        uri: poster_path
                            ? `https://image.tmdb.org/t/p/w500${poster_path}`
                            : "https://placehold.co/400x600/1a1a1a/FFFFFF?text=No+Image",
                    }}
                    className="w-full h-64 rounded-lg"
                    resizeMode="cover"
                />

                <View className="mt-2">
                    <Text className="text-sm font-bold text-white" numberOfLines={1}>
                        {title}
                    </Text>

                    <View className="flex-row items-center justify-start gap-x-1 mt-1">
                        <Image source={icons.star} className="size-4 opacity-80" />
                        <Text className={`text-xs font-bold uppercase ${getRatingColor(rating)}`}>
                            {rating} / 5
                        </Text>
                    </View>

                    {genres && (
                        <Text className="text-xs text-gray-400 mt-1" numberOfLines={1}>
                            {genres}
                        </Text>
                    )}

                    <Text className="text-xs text-gray-400">
                        {original_language.toUpperCase()} • {popularity.toFixed(1)} Popularity
                    </Text>

                    {adult && (
                        <View className="flex-row items-center gap-x-1 mt-1">
                            <Image source={icons.warning} className="size-4" />
                            <Text className="text-xs text-red-400 font-bold">Adult</Text>
                        </View>
                    )}

                    <Text className="text-xs text-gray-300 mt-1" numberOfLines={2}>
                        {overview}
                    </Text>

                    <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-xs text-gray-400 font-medium">
                            {release_date?.split("-")[0] || "Unknown"}
                        </Text>
                        <Text className="text-xs font-semibold text-gray-300 uppercase">
                            Movie
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default MovieCard;