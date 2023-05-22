import SidebarItem from "./sidebarItem.js";

// ! Ta mal pero yanimodo xd
function Sidebar(HTMLhint, dropdown) {
    this.sidebarItems = [];
    this.index = 0;
    this.HTMLhint = HTMLhint;
    this.dropdown = dropdown;

    this.createFromNodeList = function(HTMLhints, HTMLitems, HTMLcontents) {
        for (let i=0; i<HTMLhints.length; i++) {
            const newSidebarItem = new SidebarItem(HTMLhints[i], HTMLitems[i], HTMLcontents[i]);
            this.sidebarItems.push(newSidebarItem);
        }

        this.sidebarItems.forEach((sidebarItem, index) => {
            sidebarItem.HTMLitem.addEventListener('click', () => {
                this.sidebarItems.forEach((sidebarItem) => {
                    sidebarItem.disable();
                });
                sidebarItem.enable();
                HTMLhint.innerText = sidebarItem.titleHint;
                
                //this.dropdown.enable();

                // ! XDDDDDDDDDDDDDDDD 😹😹😹😹😹
                if (sidebarItem.HTMLitem.classList.contains('sub')) {
                    // ? fixed by pi 🔥
                    this.dropdown.disable();
                }
            });
        });
    };

    this.lenght = function() {
        return this.sidebarItems.lenght;
    };
};

export default Sidebar;