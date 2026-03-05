import { User } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import avatarFlat from "@/assets/images/avatarFlat.png";
import { useAuth } from "~/hooks/use-auth";

export function AppSidebar() {
	const navigate = useNavigate();
	const sidebar = useSidebar();
	const { user } = useAuth();

	const displayName =
		[user?.person?.personalInfo?.firstName, user?.person?.personalInfo?.lastName]
			.filter(Boolean)
			.join(" ") ||
		user?.userName ||
		"User";

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader
				className={`border-b border-sidebar-border ${sidebar.open ? "p-4" : ""} py-6`}>
				<div className="flex items-center justify-between w-full">
					{sidebar.open && (
						<div className="flex items-center gap-2">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<img src={avatarFlat} alt="" />
							</div>
							<div className="flex flex-col">
								<span className="font-semibold text-sm">Template App</span>
							</div>
						</div>
					)}
					<SidebarTrigger className="cursor-pointer" />
				</div>
			</SidebarHeader>
			<SidebarContent />
			<SidebarFooter className="border-t border-sidebar-border p-2 py-4">
				<button
					onClick={() => navigate(`/profile/user/${user?.id}`)}
					className={`cursor-pointer hover:bg-accent/10 rounded-lg py-2 w-full ${sidebar.open ? "px-2" : ""}`}>
					<div className="flex items-center gap-3 w-full">
						<Avatar className="size-8">
							<AvatarImage src={user?.avatar || avatarFlat} />
							{/* <AvatarFallback className="bg-muted text-muted-foreground">
								RC
							</AvatarFallback> */}
						</Avatar>
						{sidebar.open && (
							<div className="flex flex-col text-sm">
								<span className="font-medium">{displayName}</span>
							</div>
						)}
						<User className="ml-auto size-4 text-muted-foreground" />
					</div>
				</button>
				{/* <SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="justify-start cursor-pointer">
							
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu> */}
			</SidebarFooter>
		</Sidebar>
	);
}
