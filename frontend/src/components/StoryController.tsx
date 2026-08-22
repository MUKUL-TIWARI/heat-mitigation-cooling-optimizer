import React, { useEffect } from 'react';
import { useMap } from 'react-map-gl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StoryController: React.FC = () => {
  const { 'main-map': map } = useMap();

  useEffect(() => {
    if (!map) return;

    const mapInstance = map.getMap();

    // Scene 2: HEAT (Zoom in, increase pitch)
    ScrollTrigger.create({
      trigger: '#scene-heat',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        mapInstance.flyTo({
          center: [77.2, 28.6],
          zoom: 14.5,
          pitch: 60,
          bearing: -25,
          duration: 3000,
          essential: true
        });
      },
      onEnterBack: () => {
        mapInstance.flyTo({
          center: [77.2, 28.6],
          zoom: 14.5,
          pitch: 60,
          bearing: -25,
          duration: 3000,
          essential: true
        });
      }
    });

    // Scene 3: DRIVERS (Change bearing, closer to hotspot)
    ScrollTrigger.create({
      trigger: '#scene-drivers',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        mapInstance.flyTo({
          center: [77.21, 28.59],
          zoom: 15.5,
          pitch: 45,
          bearing: 30,
          duration: 3500,
          essential: true
        });
      },
      onEnterBack: () => {
        mapInstance.flyTo({
          center: [77.21, 28.59],
          zoom: 15.5,
          pitch: 45,
          bearing: 30,
          duration: 3500,
          essential: true
        });
      }
    });

    // Scene 4: ACTION (Pan to a specific area for intervention)
    ScrollTrigger.create({
      trigger: '#scene-action',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        mapInstance.flyTo({
          center: [77.22, 28.58],
          zoom: 16,
          pitch: 75,
          bearing: 90,
          duration: 3500,
          essential: true
        });
      },
      onEnterBack: () => {
        mapInstance.flyTo({
          center: [77.22, 28.58],
          zoom: 16,
          pitch: 75,
          bearing: 90,
          duration: 3500,
          essential: true
        });
      }
    });

    // Scene 1 (Hero) reset
    ScrollTrigger.create({
      trigger: 'header',
      start: 'top top',
      onEnterBack: () => {
        mapInstance.flyTo({
          center: [77.2, 28.6],
          zoom: 13,
          pitch: 45,
          bearing: -17.6,
          duration: 3000,
          essential: true
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [map]);

  return null;
};

export default StoryController;
