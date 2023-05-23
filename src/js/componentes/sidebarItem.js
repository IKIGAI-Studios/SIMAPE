class SidebarItem {
    constructor(titleHint, HTMLitem, HTMLcontent) {
        this.titleHint = titleHint;
        this.HTMLitem = HTMLitem;
        this.HTMLcontent = HTMLcontent;
        this.active = false;

        this.enable = function () {
            this.active = true;
            this.HTMLitem.classList.add('activo');
            this.HTMLcontent.classList.add('activo');
        };

        this.disable = function () {
            this.active = false;
            this.HTMLitem.classList.remove('activo');
            this.HTMLcontent.classList.remove('activo');
        };
    }
};

export default SidebarItem;