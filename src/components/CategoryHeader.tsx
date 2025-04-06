import React from "react";
import Image from "next/image";

type CategoryHeaderProps = {
  name: string;
  description?: string;
  imageUrl?: string;
};

export default function CategoryHeader({
  name,
  description,
  imageUrl,
}: CategoryHeaderProps) {
  return (
    <div className="relative">
      {imageUrl ? (
        <div className="w-full h-64 relative mb-6 rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            priority
            className="brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {name}
            </h1>
            {description && (
              <p className="text-white/90 text-lg max-w-2xl">{description}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-6 bg-gray-100 rounded-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
          {description && (
            <p className="text-gray-700 text-lg max-w-2xl">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
