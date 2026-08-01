"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  label?: string;
  active?: boolean;
}

export default function BuildViewer({ label = "RRS", active = true }: Props) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mount.current || !active) return;

    const w = mount.current.clientWidth || 320;
    const h = mount.current.clientHeight || 200;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0e);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(2.2, 1.6, 2.8);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x404050, 0.6));
    const key = new THREE.DirectionalLight(0xff6b00, 1.2);
    key.position.set(3, 4, 2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4488ff, 0.4);
    fill.position.set(-2, 1, -1);
    scene.add(fill);

    const coreGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      metalness: 0.4,
      roughness: 0.35,
      flatShading: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const shellGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0xff6b00,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    scene.add(shell);

    const ringGeo = new THREE.TorusGeometry(1.15, 0.02, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;
    scene.add(ring);

    const count = 80;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.4 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xffaa66, size: 0.03, transparent: true, opacity: 0.7 });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    let raf = 0;
    const animate = () => {
      core.rotation.y += 0.008;
      core.rotation.x += 0.003;
      shell.rotation.y -= 0.005;
      shell.rotation.z += 0.002;
      ring.rotation.z += 0.004;
      points.rotation.y += 0.0015;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount.current) return;
      const nw = mount.current.clientWidth;
      const nh = mount.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (mount.current && renderer.domElement.parentNode === mount.current) {
        mount.current.removeChild(renderer.domElement);
      }
    };
  }, [active]);

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg border border-[#2a2a32] bg-[#0c0c0e] md:h-56">
      <div ref={mount} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-2 left-3 text-[10px] tracking-widest text-[#55556a]">
        {label} · build viewer
      </div>
    </div>
  );
}
