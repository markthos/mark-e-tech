"use client"


import { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { gsap } from "gsap";



type AvatarProps = {
    images: ImageField[];
    className?: string;
};

export default function Avatar({ images, className }: AvatarProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const component = useRef(null)


    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(
                ".avatar",
                {
                    opacity: 0,
                    scale: 1.4,
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.3,
                    ease: "power3.inOut",
                },
            );
            window.onmousemove = (e) => {
                if (!component.current) return;
                const componentRect = (component.current as HTMLElement).getBoundingClientRect();
                const componentCenterX = componentRect.left + componentRect.width / 2;

                let componentPercent = {
                    x: (e.clientX - componentCenterX) / componentRect.width / 2,
                }

                let distFromCenter = 1 - Math.abs(componentPercent.x);

                gsap.timeline({
                    defaults: {
                        duration: 0.5,
                        overwrite: "auto",
                        ease: "power3.out",
                    },
                }).to(".avatar", {
                    rotation: gsap.utils.clamp(-2, 2, 5*componentPercent.x),
                    duration: 0.5,
                }, 0
                ).to(".highlight", {
                    opacity: distFromCenter - 0.7,
                    x: -10 + 20 * componentPercent.x,
                    duration: 0.5,
                },
                0
                )
            };
        }, component);
    },[]);

    const handleClick = () => {
        gsap.to(".avatar-image", {
            opacity: 0, // Fade out the current image
            duration: 0.3, // Set transition time
            onComplete: () => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                gsap.to(".avatar-image", {
                    opacity: 1, // Fade in the new image
                    duration: 0.3, // Set transition time
                    ease: "power4.inOut", // Soft easing effect
                });
            },
        });
    };
        
    return (
        <div
            ref={component}
            className={clsx("relative h-full w-full", className)}
            onClick={handleClick}
            style= {{cursor: "pointer"}}
        >
            <div className="avatar aspect-square overflow-hidden rounded-3xl border-2 border-slate-700 opacity-0">
                <PrismicNextImage
                    field={images[currentIndex]}
                    className="avatar-image h-full w-full object-cover"
                    imgixParams={{ q: 90 }}
                />
                <div className="highlight absolute inset-0 hidden w-full scale -110 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 md:block"></div>
            </div>
        </div>
    );
}