var mood;

var views = ['login', 'main', 'signup'];

function selectMood(choice) {
    location.href = "/playListChooser";
    mood = choice;
};

function switchWindow(choice) {
    views.forEach(view => {
        if(view === choice){
            location.href= "/" + choice
        } else {
            // make it invisible
        }
    });
}

// List generator
function generatePlayList() {
    
}