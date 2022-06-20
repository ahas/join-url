function normalize(args) {
    args = args.map((x) => String(x));
    const resultArray = [];
    if (args.length === 0) {
        return "";
    }
    else if (args.length === 1) {
        return "" + args[1];
    }
    if (typeof args[0] !== "string") {
        throw new TypeError("Url must be a string. Received " + args[0]);
    }
    // If the first part is a plain protocol, we combine it with the next part.
    if (args[0].match(/^[^/:]+:\/*$/) && args.length > 1) {
        const first = args.shift();
        args[0] = first + args[0];
    }
    // There must be two or three slashes in the file protocol, two slashes in anything else.
    if (args[0].match(/^file:\/\/\//)) {
        args[0] = args[0].replace(/^([^/:]+):\/*/, "$1:///");
    }
    else {
        args[0] = args[0].replace(/^([^/:]+):\/*/, "$1://");
    }
    for (let i = 0; i < args.length; i++) {
        let component = args[i];
        if (typeof component !== "string") {
            throw new TypeError("Url must be a string. Received " + component);
        }
        if (component === "") {
            continue;
        }
        if (i > 0) {
            // Removing the starting slashes for each component but the first.
            component = component.replace(/^[\/]+/, "");
        }
        if (i < args.length - 1) {
            // Removing the ending slashes for each component but the last.
            component = component.replace(/[\/]+$/, "");
        }
        else {
            // For the last component we will combine multiple slashes to a single one.
            component = component.replace(/[\/]+$/, "/");
        }
        resultArray.push(component);
    }
    let str = resultArray.join("/");
    // Each input component is now separated by a single slash except the possible first plain protocol part.
    // remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!])/g, "$1");
    // replace ? in parameters with &
    const parts = str.split("?");
    str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
    return str;
}
export default function (...params) {
    let input;
    if (typeof params[0] === "object") {
        input = params[0];
    }
    else {
        input = [].slice.call(params);
    }
    return normalize(input);
}
