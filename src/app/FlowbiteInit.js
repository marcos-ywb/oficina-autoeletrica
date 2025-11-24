"use client";

import { useEffect } from "react";
import { initFlowbite } from "flowbite";
import "flowbite";

export default function FlowbiteInit() {
    useEffect(() => {
        initFlowbite();

        const handleClickOutside = (event) => {
            const dropdowns = document.querySelectorAll("[data-dropdown-toggle]");
            dropdowns.forEach((button) => {
                const targetId = button.getAttribute("data-dropdown-toggle");
                const dropdown = document.getElementById(targetId);

                if (dropdown && !dropdown.classList.contains("hidden")) {
                    if (
                        !dropdown.contains(event.target) &&
                        !button.contains(event.target)
                    ) {
                        dropdown.classList.add("hidden");
                    }
                }
            });
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return null;
}