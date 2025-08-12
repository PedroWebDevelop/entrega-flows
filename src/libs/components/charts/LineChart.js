function createSupplierChart() {
    let data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    let chart = FLUIGC.chart('#supplier-chart', {
        id: 'set_an_id_for_my_chart',
        width: '700',
        height: '200',
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            scaleShowHorizontalLines: true,
            scaleShowVerticalLines: true,
            bezierCurve: true,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true
        }
    });

    let options = {
        responsive: true,
        maintainAspectRatio: false,
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: true,
        bezierCurve: true,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true
    }

    let lineChart = chart.line(data, options);
    // Exemplo de atualização de dados
    lineChart.datasets[0].points[2].value = 50;
    lineChart.update();
}

window.createSupplierChart = createSupplierChart;
