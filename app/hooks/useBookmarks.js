import { useCallback, useEffect, useRef, useState } from "react";
import { getSavedResources, saveResource, removeSavedResource } from "../api/api.js";

export default function useBookmarks(enabled) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [pending, setPending] = useState(new Set());
  const inFlight = useRef(new Set());
  const generation = useRef(0);

  const load = useCallback(async () => {
    const current = ++generation.current;
    setLoading(true);
    setReady(false);
    setError("");
    try {
      const data = await getSavedResources();
      if (current !== generation.current) return;
      setResources(data.resources);
      setReady(true);
      setExpired(false);
    } catch (err) {
      if (current !== generation.current) return;
      setError(err.message);
      if (err.status === 401) {
        setExpired(true);
        setResources([]);
      }
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
    else {
      setResources([]);
      setReady(false);
    }
    return () => { generation.current += 1; };
  }, [enabled, load]);

  const toggle = async (resource) => {
    if (!enabled || !ready || expired || inFlight.current.has(resource.id)) return;
    const current = generation.current;
    const saved = resources.some((item) => item.id === resource.id);
    inFlight.current.add(resource.id);
    setPending(new Set(inFlight.current));
    setError("");
    try {
      if (saved) await removeSavedResource(resource.id);
      else await saveResource(resource.id);
      if (current !== generation.current) return;
      setResources((items) => saved
        ? items.filter((item) => item.id !== resource.id)
        : [resource, ...items.filter((item) => item.id !== resource.id)]);
    } catch (err) {
      if (current !== generation.current) return;
      setError(err.message);
      if (err.status === 401) {
        setExpired(true);
        setResources([]);
        setReady(false);
      }
    } finally {
      inFlight.current.delete(resource.id);
      if (current === generation.current) setPending(new Set(inFlight.current));
    }
  };

  return { resources, loading, ready, error, expired, pending, toggle, reload: load };
}
