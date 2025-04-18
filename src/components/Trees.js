import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

function Trees({ roadSegments }) {
  const { scene: treeScene1 } = useGLTF('/models/tree_1.glb');
  const { scene: treeScene3 } = useGLTF('/models/tree_3.glb');

  const treeConfigs = useMemo(() => ({
    1: { model: treeScene1, scale: [6, 10, 6], yOffset: 0 },
    3: { model: treeScene3, scale: [2, 2, 2], yOffset: 0 },
  }), [treeScene1, treeScene3]);

  const roadWidth = 400;
  const treesRef = useRef({});

  useEffect(() => {
    roadSegments.forEach((zPos) => {
      if (!treesRef.current[zPos]) {
        const trees = [];
        const treeTypes = Object.keys(treeConfigs).map(Number);

        for (let i = 0; i < 30; i++) {
          let x;
          do {
            x = (Math.random() - 0.5) * 3000;
          } while (Math.abs(x) < roadWidth);

          const treeType = treeTypes[Math.floor(Math.random() * treeTypes.length)];
          const config = treeConfigs[treeType];

          trees.push({
            id: `tree-${zPos}-${i}`,
            position: [x, config.yOffset, zPos + Math.random() * 1800 - 900],
            scale: config.scale,
            model: config.model,
          });
        }

        treesRef.current[zPos] = trees;
      }
    });
  }, [roadSegments, treeConfigs]);

  return (
    <>
      {roadSegments.flatMap((zPos) =>
        treesRef.current[zPos]?.map((tree) => (
          <primitive
            key={tree.id}
            object={tree.model.clone()}
            position={tree.position}
            scale={tree.scale}
          />
        ))
      )}
    </>
  );
}

export default Trees;