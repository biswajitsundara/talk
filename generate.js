function generateHTMLFromArray(array) {
    let html = '';

    array.forEach(item => {
        if (item.type === 'notes') {
            for (const key in item) {
                if (key !== 'type') {
                    html += `<h3>${key}</h3><ul>`;
                    item[key].forEach(value => {
                        html += `<li>${value}</li>`;
                    });
                    html += '</ul>';
                }
            }
        }
    });

    console.log(html);
    return html;
}
