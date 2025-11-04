import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/HotelVisit.css";

const rooms = {
  reception: {
    image: "/images/reception.jpg",
    hotspots: [
      { top: "50%", left: "80%", target: "chambre", direction: "right" },
      { top: "60%", left: "10%", target: "restaurant", direction: "left" },
    ],
  },
  chambre: {
    image: "/images/chambre.jpg",
    hotspots: [
      { top: "70%", left: "15%", target: "reception", direction: "left" },
    ],
  },
  restaurant: {
    image: "/images/restaurant.jpg",
    hotspots: [
      { top: "50%", left: "85%", target: "reception", direction: "right" },
    ],
  },
};

export default function HotelVisit() {
  const [currentRoom, setCurrentRoom] = useState("reception");
  const [transitioning, setTransitioning] = useState(false);
  const audioRef = useRef(null);
  const room = rooms[currentRoom];

  // 🔊 Lancer la musique d’ambiance globale (une seule fois)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const handleChangeRoom = (target) => {
    if (transitioning) return;
    setTransitioning(true);

    // délai pendant le fondu noir
    setTimeout(() => {
      setCurrentRoom(target);
      setTransitioning(false);
    }, 1000);
  };

  return (
    <div className="hotel-container">
      {/* Overlay noir pour transition */}
      <motion.div
        key={`fade-${currentRoom}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`fade-overlay ${transitioning ? "active" : ""}`}
      />

      {/* Image principale + flèches */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoom}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="room-background"
          style={{
            backgroundImage: `url(${room.image})`,
          }}
        >
          {room.hotspots.map((spot, i) => (
            <img
              key={i}
              src={`/images/arrow-${spot.direction}.png`}
              alt="arrow"
              className="arrow"
              style={{
                top: spot.top,
                left: spot.left,
              }}
              onClick={() => handleChangeRoom(spot.target)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Mini carte de navigation */}
      <div className="mini-map">
        <img src="/images/map.png" alt="Plan" className="map-image" />
        <div className="map-buttons">
          {Object.keys(rooms).map((roomKey) => (
            <button
              key={roomKey}
              onClick={() => handleChangeRoom(roomKey)}
              className={`map-btn ${
                currentRoom === roomKey ? "active" : ""
              }`}
            >
              {roomKey.charAt(0).toUpperCase() + roomKey.slice(1)}
            </button>
          ))}
        </div>
      </div>
<audio
  ref={audioRef}
  src="https://www.youtube.com/watch?v=D4cJfCmNiwQ&list=RDD4cJfCmNiwQ&start_radio=1"
  loop
  autoPlay
/>

    </div>
  );
}
