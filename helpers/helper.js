module.exports = {
    capitalize :(username) =>{
        const name = username.toLowerCase();
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        return capitalizedName;
    }
}