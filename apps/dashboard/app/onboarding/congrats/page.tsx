"use client";
import { TextGenerateEffect } from "@optima/ui/components/text-animate";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CongratsPage() {
	const router = useRouter();
	useEffect(() => {
		setTimeout(() => {
			runConfetti();
		}, 2000);
	}, []);

	useEffect(() => {
		setTimeout(() => {
			router.push("/");
		}, 5000);
	}, [router]);

	return (
		<div className="flex-grow grid place-content-center ">
			<TextGenerateEffect
				words="Congratulations You're All Set."
				className="max-w-2xl"
			/>
		</div>
	);
}

function runConfetti() {
	const end = Date.now() + 3 * 1000; // 3 seconds
	const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

	const frame = () => {
		if (Date.now() > end) return;

		confetti({
			particleCount: 2,
			angle: 60,
			spread: 55,
			startVelocity: 60,
			origin: { x: 0, y: 0.5 },
			colors: colors,
		});
		confetti({
			particleCount: 2,
			angle: 120,
			spread: 55,
			startVelocity: 60,
			origin: { x: 1, y: 0.5 },
			colors: colors,
		});

		requestAnimationFrame(frame);
	};

	frame();
}
