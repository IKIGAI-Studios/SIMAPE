class SuperDate {
    static today() {
        const date = new Date();

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const actualDate = `${year}-${month}-${day}`;

        return actualDate;
    }
    
} 

export default SuperDate;