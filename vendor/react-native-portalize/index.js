import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';

const PortalContext = createContext(null);

export const PortalProvider = ({ children }) => {
  const [portals, setPortals] = useState([]);

  const mount = (key, node) => setPortals(prev => [...prev, { key, node }]);
  const update = (key, node) =>
    setPortals(prev => prev.map(p => (p.key === key ? { key, node } : p)));
  const unmount = key => setPortals(prev => prev.filter(p => p.key !== key));

  return (
    <PortalContext.Provider value={{ mount, update, unmount }}>
      {children}
      {portals.map(({ key, node }) => (
        <View key={key} pointerEvents="box-none" style={StyleSheet.absoluteFill}>
          {node}
        </View>
      ))}
    </PortalContext.Provider>
  );
};

let nextKey = 0;

export const Portal = ({ children }) => {
  const keyRef = useRef(nextKey++);
  const context = useContext(PortalContext);

  useEffect(() => {
    context?.mount(keyRef.current, children);
    return () => context?.unmount(keyRef.current);
  }, []);

  useEffect(() => {
    context?.update(keyRef.current, children);
  }, [children]);

  return null;
};
