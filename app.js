const tabs = document.querySelectorAll('.nav-item');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('selected'));
    tab.classList.add('selected');
  });
});

document.querySelectorAll('.day, .hour').forEach((item) => {
  item.addEventListener('click', () => {
    const siblings = item.parentElement.querySelectorAll('.day, .hour');
    siblings.forEach((sibling) => sibling.classList.remove('active'));
    item.classList.add('active');
  });
});
