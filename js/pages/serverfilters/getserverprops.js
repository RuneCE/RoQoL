const sleep = ms => new Promise(r => setTimeout(r, ms))
let RefreshButton

const ServerElements = []

function FindFirstId(Id){
	return document.getElementById(Id)
}

async function WaitForId(Id){
    let Element = null
  
    while (true) {
      Element = FindFirstId(Id)
      if (Element != undefined) {
        break
      }
  
      await sleep(50)
    }
  
    return Element
}

async function GetRefreshButton(){
	if (!RefreshButton){
		const RunningGames = await WaitForId("rbx-running-games")
		RefreshButton = RunningGames.getElementsByClassName("btn-more rbx-refresh refresh-link-icon btn-control-xs btn-min-width")[0]

		new MutationObserver(function(Mutations){
			Mutations.forEach(function(Mutation){
				if (Mutation.type === "attributes"){
					if (Mutation.attributeName === "disabled"){
						if (RefreshButton.getAttribute("disabled") === ""){
							for (let i = 0; i < ServerElements.length; i++){
								const Server = ServerElements[i]

								Server.removeAttribute("qol-checked")
								Server.removeAttribute("jobid")
								Server.removeAttribute("placeid")
								Server.removeAttribute("accesscode")

								const ServerRegion = Server.getElementsByClassName("text-info rbx-game-status rbx-game-server-status text-overflow server-info")[0]
								if (ServerRegion) ServerRegion.remove()
							}
						}
					}
				}
			})
		}).observe(RefreshButton, {attributes: true})
	}

	return RefreshButton
}

async function ElementAdded(Element){
	const IsRORSL = Element.classList.contains("rorsl-server")

	if (!Element.className.includes("game-server-item") || Element.classList.contains("rbx-game-server-item-container")) return
	if (Element.getAttribute("client-hooked")) return
    Element.setAttribute("client-hooked", true)

	async function UpdateInfo(){
		if (Element.getAttribute("checking-qol-checked") || Element.getAttribute("qol-checked")) return
		Element.removeAttribute("has-region")
		Element.setAttribute("checking-qol-checked", true)

		await GetRefreshButton()
		while (RefreshButton.getAttribute("disabled") === ""){
			await sleep(50)
		}

		if (IsRORSL){
			const JoinButton = Element.getElementsByClassName("rbx-game-server-join")[0]
			if (JoinButton && JoinButton.onclick){
				const Regex = new RegExp("Roblox.GameLauncher.joinGameInstance\\(([0-9]+), \"([0-9 a-z A-Z -]+)\"\\)", "gm").exec(JoinButton.onclick)
				if (Regex[2]){
					Element.setAttribute("jobid", Regex[2])
					Element.setAttribute("placeid", Regex[1])
					Element.setAttribute("qol-checked", true)
				}
			}

			Element.removeAttribute("checking-qol-checked")
			return
		}

		AngularInfo = angular.element(Element).context[Object.keys(angular.element(Element).context)[0]]

		if (!AngularInfo){
			//Element.removeAttribute("qol-checked")
			Element.removeAttribute("checking-qol-checked")
			return
		}

		let ServerInfo = AngularInfo.return.memoizedProps
		let Attempts = 0

		while (!ServerInfo && Attempts < 5){
			await sleep(100)
			ServerInfo = AngularInfo.return.memoizedProps
			Attempts++
		}
		
		if (!ServerInfo || ServerInfo.id == undefined){
			//Element.removeAttribute("qol-checked")
			Element.removeAttribute("checking-qol-checked")
			return
		}

		Element.setAttribute("jobid", ServerInfo.id)
		Element.setAttribute("placeid", ServerInfo.placeId)

		if (Element.classList.contains("rbx-private-game-server-item")) {
			Element.setAttribute("accesscode", ServerInfo.accessCode)
		}

		Element.setAttribute("qol-checked", true)
		Element.removeAttribute("checking-qol-checked")
	}
	
	ServerElements.push(Element)

	new MutationObserver(function(Mutations){
		Mutations.forEach(function(Mutation){
			if (Mutation.type === "attributes"){
				if (Mutation.attributeName === "qol-checked"){
					UpdateInfo()
				}
			}
		})
	}).observe(Element, {attributes: true})

	const ThumbnailContainer = Element.getElementsByClassName("player-thumbnails-container")[0]

	if (ThumbnailContainer){
		let ServerUpdatedDefer = false
		new MutationObserver(function(Mutations){
			if (ServerUpdatedDefer) return

			Mutations.forEach(function(Mutation){
				if (ServerUpdatedDefer) return

				if (Mutation.type === "childList"){
					ServerUpdatedDefer = true
					setTimeout(function(){
						ServerUpdatedDefer = false
							
						Element.removeAttribute("jobid")
						Element.removeAttribute("placeid")
						Element.removeAttribute("accesscode")

						const ServerRegion = Element.getElementsByClassName("text-info rbx-game-status rbx-game-server-status text-overflow server-info")[0]
						if (ServerRegion) ServerRegion.remove()

						Element.removeAttribute("qol-checked")
					}, 0)
				}
			})
		}).observe(ThumbnailContainer, {childList: true})
	}

	UpdateInfo()
}

function NewServerAddedMutation(Mutations){
    Mutations.forEach(function(Mutation){
        if (Mutation.type !== "childList") return

        const NewNodes = Mutation.addedNodes

        for (let i = 0; i < NewNodes.length; i++){
            ElementAdded(NewNodes[i])
        }
    })
}

function HandleList(Id){
	WaitForId(Id).then(function(ServerList){
		new MutationObserver(NewServerAddedMutation).observe(ServerList, {childList: true})

		const children = ServerList.children

		for (let i = 0; i < children.length; i++){
			ElementAdded(children[i])
		}
	})
}

async function GetServerProps(){
	HandleList("rbx-game-server-item-container")
	HandleList("rbx-friends-game-server-item-container")
	HandleList("rbx-private-game-server-item-container")
	HandleList("rbx-running-games")
}

GetServerProps()