package com.fleettracking.security;

import com.fleettracking.entity.User;
import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails {

    private final Long id;
    private final String mobile;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean isActive;

    public UserPrincipal(Long id, String mobile, String password, Collection<? extends GrantedAuthority> authorities, boolean isActive) {
        this.id = id;
        this.mobile = mobile;
        this.password = password;
        this.authorities = authorities;
        this.isActive = isActive;
    }

    public Long getId() {
        return id;
    }

    public static UserPrincipal create(User user) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().getName().name());
        return new UserPrincipal(
                user.getId(),
                user.getMobile(),
                user.getPasswordHash() == null ? "" : user.getPasswordHash(),
                Collections.singletonList(authority),
                Boolean.TRUE.equals(user.getIsActive())
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return mobile;
    }

    @Override
    public boolean isAccountNonExpired() {
        return isActive;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return isActive;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}
