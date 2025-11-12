import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import YouTube from "react-youtube";
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
  const [soundEnabled, setSoundEnabled] = useState(false); // désactivé au départ
  const [muted, setMuted] = useState(false); // commence non muet
  const [showMap, setShowMap] = useState(false);
  const playerRef = useRef(null);
  const room = rooms[currentRoom];

  // Changer de pièce
  const handleChangeRoom = (target) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentRoom(target);
      setTransitioning(false);
    }, 1000);
  };

  // Lecteur YouTube prêt
  const onReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(50);
    // Ne pas mute ici pour pouvoir activer le son directement
  };

  // Activer le son au clic utilisateur (unmute directement)
  const handleEnableSound = () => {
    if (playerRef.current) {
      playerRef.current.unMute();
      setMuted(false);
    }
    setSoundEnabled(true);
  };

  // Toggle mute/unmute après activation
  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) playerRef.current.unMute();
    else playerRef.current.mute();
    setMuted(!muted);
  };

  return (
    <div className="hotel-container">
      {/* Overlay transition */}
      <motion.div
        key={`fade-${currentRoom}`}
        className={`fade-overlay ${transitioning ? "active" : ""}`}
      />

      {/* Pièce principale */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoom}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="room-background"
          style={{ backgroundImage: `url(${room.image})` }}
        >
          {room.hotspots.map((spot, i) => (
            <img
              key={i}
              src={`/images/arrow-${spot.direction}.png`}
              alt="arrow"
              className="arrow"
              style={{ top: spot.top, left: spot.left }}
              onClick={() => handleChangeRoom(spot.target)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Mini-carte centrée en bas */}
      <div className="mini-map">
        <div className="map-header" onClick={() => setShowMap(true)}>
          <img src="/images/map.png" alt="Plan" className="map-image" />
          <div className="map-label">🗺️ Agrandir</div>
        </div>
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

      {/* Popin carte agrandie */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            className="map-popin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="map-popin"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <button
                className="close-btn"
                onClick={() => setShowMap(false)}
              >
                ✖
              </button>
              <img
                src="/images/map.png"
                alt="Plan détaillé"
                className="map-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton de son */}
      <div className="sound-controls">
        {!soundEnabled ? (
          <button className="sound-btn" onClick={handleEnableSound}>
            🎵 Activer le son
          </button>
        ) : (
          <button className="sound-btn" onClick={toggleMute}>
            {muted ? "🔇" : "🔊"}
          </button>
        )}
      </div>

      {/* Lecteur YouTube en fond */}
      {soundEnabled && (
        <YouTube
          videoId="-fN-Xjpd-qE"
          opts={{
            playerVars: {
              autoplay: 1,
              loop: 1,
              playlist: "-fN-Xjpd-qE",
              controls: 0,
              modestbranding: 1,
            },
          }}
          onReady={onReady}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
}
