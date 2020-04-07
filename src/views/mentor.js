export const cleanupPostsTimestamps = () => {
    document.querySelectorAll(".post-body .created-at").forEach((el) => {
        el.innerHTML = el.innerHTML.replace(/less than|posted|about/g,"")
    });
}
export const renameLeaveButton = () => {
    if (document.querySelector("a.leave-button"))
        document.querySelector("a.leave-button").innerHTML="Leave Discussion"
}


export const tweakNotificationText = () => {
    let ignore = document.querySelector(".notification .ignore")
    if (ignore) {
      ignore.innerHTML = ignore.innerHTML.replace("No action is required",
        "No response needed")
        // "Ignore it for now")
      let notification = document.querySelector(".notification")
      notification.innerHTML = notification.innerHTML.replace("requires your action.","may require a response.")
    }
}