document.getElementById('dropbtn').addEventListener('click', function() {
    document.getElementById('dropdown-content').classList.toggle('show');
});

document.getElementById('dropbtn').addEventListener('click', function() {
    var dropdownContent = document.getElementById('dropdown-content');
    if (dropdownContent.style.display === 'none' || dropdownContent.style.display === '') {
        dropdownContent.style.display = 'block';
        dropdownContent.style.animation = 'slide-down 0.5s forwards';
        dropdownContent.classList.add('show');
    } else {
        dropdownContent.style.animation = 'slide-up 0.5s forwards';
        setTimeout(function() {
            dropdownContent.style.display = 'none';
            dropdownContent.classList.remove('show');
        }, 500); // match the duration of the animation
    }
});

// Add event listener to each link in the dropdown menu
var dropdownLinks = document.querySelectorAll('.dropdown-content a');
dropdownLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default action of the link
        document.querySelector('iframe').src = this.getAttribute('href'); // Change the src attribute of the iframe
    });
});