// ==UserScript==
// @name     Discord right click link fix	
// @version  1
// @grant    none
// @require https://code.jquery.com/jquery-3.6.0.js
// @include https://discord.com*
// ==/UserScript==

$(document).ready(function ()
{
	onElementCreation("a", function ()
	{
		// If link belongs to a message
		if ($(this).parents("[class*=\"messageContent-\"]").length > 0)
		{
			$(this).on("contextmenu", function (e)
			{
				if (e.button == 2)
				{
					e.stopPropagation();
				}
			});
		}
	});
});



// Calls the callback with the matching element as the `this` object
// Return true in the callback to disconnect the observer
// Works with child elements instead of just parent elements
// Requires jquery

function onElementCreation(selector, callback)
{
	var elements = document.querySelectorAll(selector);

	for (var el of elements)
	{
		if (callback(el) === true)
			return;
	}

	var observer = new MutationObserver(function (mutations)
	{
		mutations.some(mutation =>
		{
			return Array.from(mutation.addedNodes).some(node =>
			{
				var elements = Array();

				if ($(node).is(selector) == true)
					elements.push(node);

				elements = elements.concat(Array.from($(node).find(selector)));

				return elements.some(e =>
				{
					if (callback.bind(e)() === true)
					{
						observer.disconnect();

						return true;
					}
				});
			});
		});
	});

	observer.observe(document.documentElement, { childList: true, subtree: true });
}
