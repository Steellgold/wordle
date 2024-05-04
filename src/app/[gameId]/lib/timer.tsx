"use client";

import { Component } from "@/lib/components/utils/component";
import { addZero, minimize } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCountdown, useWindowSize } from "usehooks-ts";

type TimerProps = {
  onEnd: () => Promise<void>;
};

export const Timer: Component<TimerProps> = ({ onEnd }) => {
  const [intervalValue] = useState<number>(1000)
  const [count, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({ countStart: 10, intervalMs: intervalValue })
  
  const { width } = useWindowSize();

  useEffect(() => {
    startCountdown();

    if (count === 0) {
      resetCountdown();
      stopCountdown();
      onEnd();
    }
  }, [count, onEnd, startCountdown, stopCountdown, resetCountdown]);

  return (
    <>
      <strong>{addZero(parseInt((count / 60).toString() ?? "0"))} {minimize("minutes", "mins", width)}</strong>
      <strong> {addZero(count % 60)} {minimize("seconds", "s", width)}</strong>
    </>
  );
};