export const HeroSkeleton = ({ variant }: { variant: string }) => {
    switch (variant) {
        case "main":
            return (
                <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-gray-200 animate-pulse">
                    {/* Simulated dark overlay */}
                    <div className="absolute inset-0 bg-gray-300/60" />

                    <div className="absolute inset-0 flex items-center px-4 md:px-12">
                        <div className="max-w-xl w-full space-y-4">
                            {/* Title lines */}
                            <div className="h-8 md:h-10 w-3/4 rounded-md bg-gray-400/50" />
                            <div className="h-8 md:h-10 w-1/2 rounded-md bg-gray-400/50" />

                            {/* Button */}
                            <div className="mt-4 h-10 w-36 rounded-md bg-gray-400/50" />
                        </div>
                    </div>
                </section>
            );
        case "home":
            return (
                <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gray-300/60" />
                    <div className="absolute inset-0 flex items-center px-4 md:px-12">
                        <div className="max-w-xl w-full space-y-4">
                            <div className="h-8 md:h-10 w-3/4 rounded-md bg-gray-400/50" />
                            <div className="h-8 md:h-10 w-1/2 rounded-md bg-gray-400/50" />
                            <div className="h-8 md:h-10 w-2/3 rounded-md bg-gray-400/50" />
                        </div>
                    </div>
                </section>
            );
        case "shop":
            return (
                <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gray-300/60" />
                    <div className="absolute inset-0 flex items-center justify-center px-4">
                        <div className="flex flex-col items-center space-y-4 w-full">
                            <div className="h-4 w-32 rounded-md bg-gray-400/50" />
                            <div className="h-10 md:h-12 w-3/4 max-w-md rounded-md bg-gray-400/50" />
                            <div className="h-4 w-full max-w-lg rounded-md bg-gray-400/50" />
                            <div className="h-4 w-2/3 max-w-sm rounded-md bg-gray-400/50" />
                        </div>
                    </div>
                </section>
            );
    }
};