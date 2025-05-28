import React, {
    useRef,
    useState,
    useEffect,
    ReactNode,
    MouseEventHandler,
    UIEvent,
  } from "react";
  import { motion, useInView } from "framer-motion";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

  
  interface AnimatedItemProps {
    children: ReactNode;
    delay?: number;
    index: number;
    onMouseEnter?: MouseEventHandler<HTMLDivElement>;
    onClick?: MouseEventHandler<HTMLDivElement>;
  }
  
  const AnimatedItem: React.FC<AnimatedItemProps> = ({
    children,
    delay = 0,
    index,
    onMouseEnter,
    onClick,
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.5, once: false });
    return (
      <motion.div
        ref={ref}
        data-index={index}
        onMouseEnter={onMouseEnter}
        onClick={onClick}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.2, delay }}
        className="mb-4 cursor-pointer"
      >
        {children}
      </motion.div>
    );
  };
  
  interface Employee {
    name: string;
    gender: string;
    maritalStatus: string;
    phone: string;
    email: string;
    address: string;
    dob: string;
    nationality: string;
    hireDate: string;
    department: string;
  }

  interface AnimatedListProps {
    items?: Employee[];
    onItemSelect?: (item: Employee, index: number) => void;
    showGradients?: boolean;
    enableArrowNavigation?: boolean;
    className?: string;
    itemClassName?: string;
    displayScrollbar?: boolean;
    initialSelectedIndex?: number;
  }

  const Detail = ({ label, value, className }: { label: string; value: string; className?: string }) => (
    <div className={`${className} grid grid-cols-3 gap-y-2 border-b border-muted-foreground/30 pb-1`}>
      <span className="text-muted-foreground font-medium ">{label}:</span>
      <span
        className={`text-foreground font-normal col-span-2 ${
          label.toLowerCase() === 'email' ? '' : 'capitalize'
        }`}
      >
        {value}
      </span>
    </div>
  );
  
  const AnimatedList: React.FC<AnimatedListProps> = ({
    items = [],
    onItemSelect,
    showGradients = true,
    enableArrowNavigation = true,
    className = "",
    itemClassName = "",
    displayScrollbar = true,
    initialSelectedIndex = -1,
  }) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] =
      useState<number>(initialSelectedIndex);
    const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
    const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
    const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);
  
    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } =
        e.target as HTMLDivElement;
      setTopGradientOpacity(Math.min(scrollTop / 50, 1));
      const bottomDistance = scrollHeight - (scrollTop + clientHeight);
      setBottomGradientOpacity(
        scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
      );
    };
  
    // Keyboard navigation: arrow keys, tab, and enter selection
    useEffect(() => {
      if (!enableArrowNavigation) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
          e.preventDefault();
          setKeyboardNav(true);
          setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
        } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
          e.preventDefault();
          setKeyboardNav(true);
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter") {
          if (selectedIndex >= 0 && selectedIndex < items.length) {
            e.preventDefault();
            if (onItemSelect) {
              onItemSelect(items[selectedIndex], selectedIndex);
            }
          }
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);
  
    // Scroll the selected item into view if needed
    useEffect(() => {
      if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
      const container = listRef.current;
      const selectedItem = container.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement | null;
      if (selectedItem) {
        const extraMargin = 50;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const itemTop = selectedItem.offsetTop;
        const itemBottom = itemTop + selectedItem.offsetHeight;
        if (itemTop < containerScrollTop + extraMargin) {
          container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
        } else if (
          itemBottom >
          containerScrollTop + containerHeight - extraMargin
        ) {
          container.scrollTo({
            top: itemBottom - containerHeight + extraMargin,
            behavior: "smooth",
          });
        }
      }
      setKeyboardNav(false);
    }, [selectedIndex, keyboardNav]);
  
    return (
      <div className={`relative w-[500px] ${className}`}>
        <div
          ref={listRef}
          className={`max-h-[750px] overflow-y-auto p-4 ${
            displayScrollbar
              ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#060606] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-[4px]"
              : "scrollbar-hide"
          }`}
          onScroll={handleScroll}
          style={{
            scrollbarWidth: displayScrollbar ? "thin" : "none",
            scrollbarColor: "#222 #060606",
          }}
        >
          {items && items.map((item, index) => (
            <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => {
              setSelectedIndex(index);
              if (onItemSelect) {
                onItemSelect(item, index);
              }
            }}
          >
            <div
              className={`p-4 rounded-lg border transition-all duration-200 ${
                selectedIndex === index ? "dark:bg-[#1a1a1a] bg-[#fff] shadow-lg -translate-y-2" : "dark:bg-[#111] bg-[#fffa] "
              } ${itemClassName}`}
            >
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <div className="mx-auto  rounded-lg p-2 font-sans">
                <div className="grid grid-cols-2 gap-4 space-y-2">
                  <Detail label="Gender" value={item.gender} />
                  <Detail label="Marital Status" value={item.maritalStatus} />
                  <Detail label="Phone" value={item.phone} />
                  <Detail label="Email" value={item.email} />
                  <Detail label="Address" value={item.address} />
                  <Detail label="DOB" value={item.dob} />
                  <Detail label="Nationality" value={item.nationality} />
                  <Detail label="Hire Date" value={item.hireDate} />
                  <Detail label="Department" value={item.department} />
                </div>
              </div>
            </div>
          </AnimatedItem>
          ))}
        </div>
        {showGradients && (
          <>
            <div
              className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-[#060606] to-transparent pointer-events-none transition-opacity duration-300 ease"
              style={{ opacity: topGradientOpacity }}
            ></div>
            <div
              className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#060606] to-transparent pointer-events-none transition-opacity duration-300 ease"
              style={{ opacity: bottomGradientOpacity }}
            ></div>
          </>
        )}
      </div>
    );
  };
  
  export default AnimatedList;
  