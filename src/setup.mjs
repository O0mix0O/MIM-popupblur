export function setup(ctx) {
    ctx.onInterfaceReady(() => {
        const elementsToBlur = ['#page-container', '#skill-footer-minibar-container'];

        function toggleBlur(isBlurred) {
            elementsToBlur.forEach((id) => {
                const element = document.querySelector(id);
                if (element) {
                    element.style.filter = isBlurred ? 'blur(5px)' : 'none';
                }
            });
        }

        function isElementVisible(element) {
            // Check if the element is visible by checking its computed display and aria-hidden values
            const style = window.getComputedStyle(element);
            const isHidden = style.display === 'none' || element.getAttribute('aria-hidden') === 'true';
            return !isHidden;
        }

        function monitorModalClasses() {
            const intervalId = setInterval(() => {
                // Check if any visible element has 'swal-infront' or 'modal-infront' class
                const infrontElements = document.querySelectorAll('.swal-infront, .modal-infront');
                const isAnyElementVisible = Array.from(infrontElements).some(element => isElementVisible(element));

                toggleBlur(isAnyElementVisible);

                // Stop monitoring when no visible element is found
                if (!isAnyElementVisible) {
                    clearInterval(intervalId);
                    toggleBlur(false);
                }
            }, 100);
        }

        // Start monitoring the elements with 'swal-infront' or 'modal-infront' classes
        monitorModalClasses();

        // Watch for dynamically added elements and apply the blur if necessary
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Check for newly added nodes
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Ensure it's an element node
                        if (node.classList.contains('swal-infront') || node.classList.contains('modal-infront')) {
                            // Apply the blur to the newly added element
                            if (isElementVisible(node)) {
                                toggleBlur(true);
                            }
                        }
                    }
                });
            });
        });

        // Set the observer to watch for added nodes in the document body
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}