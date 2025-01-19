export function setup(ctx) {
    ctx.onInterfaceReady(() => {
        const elementsToBlur = ['#page-container', '#skill-footer-minibar-container'];

        let isBlurActive = false; // Track the current blur state

        function toggleBlur(isBlurred) {
            isBlurActive = isBlurred; // Update the blur state

            // Blur or unblur the main elements
            elementsToBlur.forEach((id) => {
                const element = document.querySelector(id);
                if (element) {
                    element.style.filter = isBlurred ? 'blur(5px)' : 'none';
                }
            });

            // Blur or unblur all existing `game-notification` elements
            const notifications = document.querySelectorAll('game-notification');
            notifications.forEach((notification) => {
                notification.style.filter = isBlurred ? 'blur(5px)' : 'none';
            });
        }

        function isElementVisible(element) {
            // Check if the element is visible by checking its computed display and aria-hidden values
            const style = window.getComputedStyle(element);
            const isHidden = style.display === 'none' || element.getAttribute('aria-hidden') === 'true';
            return !isHidden;
        }

        function checkModalVisibility() {
            // Check if any visible element has 'swal-infront' or 'modal-infront' class
            const infrontElements = document.querySelectorAll('.swal-infront, .modal-infront');
            const isAnyElementVisible = Array.from(infrontElements).some(element => isElementVisible(element));

            toggleBlur(isAnyElementVisible);
        }

        // Force an initial check when the game is first loaded to ensure the blur is applied
        setTimeout(() => {
            // Check for modals on initial load
            checkModalVisibility();
        }, 0);

        // Watch for dynamically added or removed elements and apply/remove the blur if necessary
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Handle added nodes
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Ensure it's an element node
                        // Check if a modal is added
                        if (node.classList.contains('swal-infront') || node.classList.contains('modal-infront')) {
                            checkModalVisibility();
                        }

                        // Apply blur to newly added `game-notification` elements if blur is active
                        if (node.tagName === 'GAME-NOTIFICATION') {
                            node.style.filter = isBlurActive ? 'blur(5px)' : 'none';
                        }
                    }
                });

                // Handle removed nodes
                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Ensure it's an element node
                        // Check if a modal is removed
                        if (node.classList.contains('swal-infront') || node.classList.contains('modal-infront')) {
                            checkModalVisibility();
                        }
                    }
                });
            });
        });

        // Separate observer to monitor changes to `game-notification` elements
        const notificationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.tagName === 'GAME-NOTIFICATION') {
                        // Apply blur to any newly added `game-notification` if blur is active
                        node.style.filter = isBlurActive ? 'blur(5px)' : 'none';
                    }
                });
            });
        });

        // Set the observer to watch for added and removed nodes in the document body
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Watch specifically for changes in the `game-notification` container
        const notificationContainer = document.querySelector('game-notification-container');
        if (notificationContainer) {
            notificationObserver.observe(notificationContainer, {
                childList: true,
                subtree: false, // Only monitor direct children
            });
        }
    });
}
