```javascript
function calculateGrade() {
    let name = document.getElementById("name").value;

    let html = Number(document.getElementById("html").value);
    let css = Number(document.getElementById("css").value);
    let javascript = Number(document.getElementById("javascript").value);

    let average = (html + css + javascript) / 3;

    let result;

    if (average >= 75) {
        result = "PASSED";
    } else {
        result = "FAILED";
    }

    document.getElementById("result").innerHTML =
        "<b>Student:</b> " + name +
        "<br><b>Average:</b> " + average.toFixed(2) +
        "<br><b>Result:</b> " + result;
}
```
