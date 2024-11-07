const tooltipTriggerList = document.querySelectorAll('.tooltippww');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
