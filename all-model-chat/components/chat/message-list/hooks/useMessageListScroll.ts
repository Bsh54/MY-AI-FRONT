
import { useRef, useState, useCallback, useEffect } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';
import { ChatMessage } from '../../../types';

interface UseMessageListScrollProps {
    messages: ChatMessage[];
    setScrollContainerRef: (node: HTMLDivElement | null) => void;
    activeSessionId: string | null;
}

export const useMessageListScroll = ({ messages, setScrollContainerRef, activeSessionId }: UseMessageListScrollProps) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [atBottom, setAtBottom] = useState(true);
    const [scrollerRef, setInternalScrollerRef] = useState<HTMLElement | null>(null);
    const visibleRangeRef = useRef({ startIndex: 0, endIndex: 0 });

    // --- Auto-scroll Logic for Progressive Streaming ---
    const lastMessage = messages[messages.length - 1];
    const isStreaming = lastMessage?.role === 'model' && lastMessage?.isLoading;
    const lastContentLength = useRef(0);

    useEffect(() => {
        if (isStreaming && atBottom) {
            const currentLength = lastMessage?.content?.length || 0;
            if (currentLength > lastContentLength.current) {
                // We use requestAnimationFrame to sync with browser's paint cycle for smoothness
                requestAnimationFrame(() => {
                    virtuosoRef.current?.scrollToIndex({
                        index: messages.length - 1,
                        align: 'end',
                        behavior: 'auto' // 'auto' is better for frequent small jumps than 'smooth'
                    });
                });
            }
            lastContentLength.current = currentLength;
        } else if (!isStreaming) {
            lastContentLength.current = 0;
        }
    }, [lastMessage?.content, isStreaming, atBottom, messages.length]);
    
    const scrollSaveTimeoutRef = useRef<number | null>(null);
    const lastRestoredSessionIdRef = useRef<string | null>(null);
    
    // Track the last index we programmatically scrolled to
    const lastScrollTarget = useRef<number | null>(null);

    // Track state for the anchoring effect specifically
    const prevMsgCount = useRef(messages.length);
    const prevSessionIdForAnchor = useRef(activeSessionId);

    // Sync internal scroller ref with parent's expectations
    useEffect(() => {
        if (scrollerRef) {
            setScrollContainerRef(scrollerRef as HTMLDivElement);
        }
    }, [scrollerRef, setScrollContainerRef]);

    // Range tracking for navigation
    const onRangeChanged = useCallback(({ startIndex, endIndex }: { startIndex: number, endIndex: number }) => {
        visibleRangeRef.current = { startIndex, endIndex };
    }, []);

    // --- Logique de défilement collant ---
    useEffect(() => {
        if (!activeSessionId || messages.length === 0) return;

        // Cas 1 : On change de chat -> Saut immédiat en bas
        if (lastRestoredSessionIdRef.current !== activeSessionId) {
            lastRestoredSessionIdRef.current = activeSessionId;
            prevMsgCount.current = messages.length;

            setTimeout(() => {
                virtuosoRef.current?.scrollToIndex({
                    index: messages.length - 1,
                    align: 'end',
                    behavior: 'auto'
                });
                setAtBottom(true);
            }, 100);
            return;
        }

        // Cas 2 : Nouveaux messages ou texte qui s'écrit -> On suit si on est déjà en bas
        if (messages.length > prevMsgCount.current || isStreaming) {
            if (atBottom) {
                virtuosoRef.current?.scrollToIndex({
                    index: messages.length - 1,
                    align: 'end',
                    behavior: isStreaming ? 'auto' : 'smooth'
                });
            }
            prevMsgCount.current = messages.length;
        }
    }, [activeSessionId, messages, atBottom, isStreaming]);

    const handleScroll = useCallback(() => {
        if (document.hidden || !scrollerRef) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollerRef;
        // If we're within 150px of the bottom, consider it "at bottom"
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;

        if (isAtBottom !== atBottom) {
            setAtBottom(isAtBottom);
        }
    }, [scrollerRef, atBottom]);

    // Attach listener manually to the scroller ref
    useEffect(() => {
        const container = scrollerRef;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [scrollerRef, handleScroll]);

    const showScrollDown = !atBottom;
    const showScrollUp = messages.length > 2 && visibleRangeRef.current.startIndex > 0;

    return {
        virtuosoRef,
        setInternalScrollerRef,
        setAtBottom,
        onRangeChanged,
        scrollToPrevTurn,
        scrollToNextTurn,
        showScrollDown,
        showScrollUp,
        scrollerRef,
        handleScroll
    };
};
