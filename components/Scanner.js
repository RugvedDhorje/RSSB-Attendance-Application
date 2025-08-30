"use client";
import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useAuth } from "../context/AuthContext";

const Scanner = () => {
  const { markAttendance } = useAuth();
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (scanning) {
      startScanning();
    } else {
      stopScanning();
    }
    return () => stopScanning();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  const startScanning = () => {
    codeReader.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (res, err) => {
        if (res) {
          markAttendance(res.getText());
          setScanning(false); // auto stop when found
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      }
    );
  };

  const stopScanning = () => {
    codeReader.current.reset();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    // <div className="bg-red-100 flex flex-col justify-center items-center">
    //   <button
    //     onClick={() => setScanning((prev) => !prev)}
    //     className="bg-green-500 text-white text-[20px] font-semibold px-4 py-2 rounded hover:bg-green-600"
    //   >
    //     {scanning ? "Stop QR Scanning" : "Start QR Scanning"}
    //   </button>

    //   {scanning && (
    //     <div className="py-2">
    //       <video
    //         ref={videoRef}
    //         // width="250"
    //         // height="250"
    //         style={{ border: "1px solid black" }}
    //         className="md:w-[250px] md:h-[200px] w-[150px] h-[150px]"
    //       />
    //     </div>
    //   )}
    // </div>
    <div className="flex flex-col justify-center items-center">
      <button
        onClick={() => setScanning((prev) => !prev)}
        className="bg-green-500 text-white text-[20px] font-semibold px-4 py-2 rounded-lg hover:bg-green-600"
      >
        {scanning ? "Stop QR Scanning" : "Start QR Scanning"}
      </button>

      {/* Fullscreen overlay for scanner */}
      {scanning && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-lg">
          <video
            ref={videoRef}
            autoPlay
            className="w-[90%] max-w-[400px] h-auto border-1 border-white rounded-lg"
          />
          <button
            onClick={() => setScanning(false)}
            className="mt-6 bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Close Scanner
          </button>
        </div>
      )}
    </div>
  );
};

export default Scanner;
